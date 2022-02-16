function isEmpty(d) {
    return d == null || (d instanceof String ? d : "").trim() == "";
}

function buildOption(def = () => undefined, normalizer = (val) => val) {
    return {
        handle: function (validate) {
            let defaultVal = def();
    
            try {
                return normalizer(validate);
            } catch(ex) {
                if (defaultVal) {
                    return defaultVal;
                }
                throw ex;
            }
        },
        default: def,
        normalize: normalizer
    }
}

function normalizerOnOff(val) {
    if (isEmpty(val)) undefined;
    return (val === true || val == "On") ? "On" : "Off";
}

function normalizerListish(val) {
    if (isEmpty(val)) return undefined;
    let list = [];
    for (let i of val.split(",")) {
        list.push(i.trim());
    }
    return list.join(", ");
}

module.exports = {
    //'Submit', // 'Display Web Results', 'Display Text Results' or 'Display XML Results'
    'YearTerm': buildOption(() => "2021-92", (val) => {
        val = (val || "");
        const base = "[a-zA-Z0-9]{4}-[a-zA-Z0-9]{2}";
        const strict = new RegExp("^" + base + "$");
        if (strict.test(val)) {
            return val;
        }
        
        const loose = new RegExp(base);
        let match = val.match(loose);
        if (!match) {
            throw new Error("Invalid: " + val);
        }
        return match[match.index];
    }),
    'ShowComments': buildOption(() => "On", normalizerOnOff),
    'ShowFinals': buildOption(() => "On", normalizerOnOff),
    'Breadth': buildOption(() => "ANY"), // technically accepts undefined too /f
    'Dept': buildOption(() => "ALL"), // technically accepts undefined too /f
    'CourseNum': buildOption(() => undefined, normalizerListish),
    'Division': buildOption(() => "ANY"),
    'CourseCodes': buildOption(() => undefined, normalizerListish),
    'InstrName': buildOption(),
    'CourseTitle': buildOption(),
    'ClassType': buildOption(() => "ALL"),
    'Units': buildOption(() => undefined, normalizerListish),
    'Days': buildOption(() => undefined, normalizerListish),
    'StartTime': buildOption(),
    'EndTime': buildOption(),
    'MaxCap': buildOption(() => undefined, normalizerListish),
    'FullCourses': buildOption(() => "ANY"),
    'FontSize': buildOption(() => undefined, normalizerListish),
    'CancelledCourses': buildOption(() => "Exclude"),
    'Bldg': buildOption(),
    'Room': buildOption(),
    'Submit': buildOption(() => "Display XML Results", (value) => "Display XML Results")
};