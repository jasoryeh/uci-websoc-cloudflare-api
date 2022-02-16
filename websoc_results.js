function findChildren(tag, txml_raw) {
    let temp = [];
    for (let child of txml_raw.children) {
        if (child.tagName == tag) {
            temp.push(child);
        }
    }
    return temp;
}

function findChildOrSomething(tag, txml_raw, something = null) {
    for (let child of txml_raw.children) {
        if (child.tagName == tag) {
            return child;
        }
    }
    return something;
}

function findChildOrNull(tag, txml_raw) {
    return findChildOrSomething(tag, txml_raw, null);
}

function findChildOrDummy(tag, txml_raw) {
    return findChildOrSomething(tag, txml_raw, {
        children: [null]
    });
}

function findChild(tag, txml_raw) {
    let temp = findChildOrNull(tag, txml_raw);
    if (temp == null) {
        throw new Error(`Could not parse: required tag ` + tag + ` was not found.`);
    }
    return temp;
}

class SearchCriteria {
    constructor(txml_raw) {
        this.criteria = txml_raw.children;
    }
}

class SearchCriterion {
    constructor(txml_raw) {
        this.criterion = [];
        for (let child of txml_raw.children) {
            this.criterion.push(
                new SearchCriteria(child)
            );
        }
    }
}

class Term {
    constructor(txml_raw) {
        this.yyyyst = findChild('term_yyyyst', txml_raw).children[0];
        this.year = findChild('term_year', txml_raw).children[0];
        this.term = findChild('term_name', txml_raw).children[0];
        this.status = findChild('term_status_msg', txml_raw).children[0];
    }
}

class Restriction {
    constructor(txml_raw) {
        this.code = findChild('restriction_code', txml_raw).children[0];
        this.name = findChild('restriction_def', txml_raw).children[0];
    }
}

class Restrictions {
    constructor(txml_raw) {
        this.restrictions = [];
        for (let child of txml_raw.children) {
            this.restrictions.push(
                new Restriction(child)
            );
        }
    }
}

class Section {
    constructor(txml_raw) {
        this.code = findChild('course_code', txml_raw).children[0];
        this.type = findChild('sec_type', txml_raw).children[0];
        this.number = findChild('sec_units', txml_raw).children[0];
        this.instructors = this.parseInstructors(
            findChild('sec_instructors', txml_raw)
        );
        this.final = this.parseFinal(
            findChild('sec_final', txml_raw)
        );
        this.enrollment = this.parseEnrollment(
            findChild('sec_enrollment', txml_raw)
        );
        this.books = findChild('sec_books', txml_raw).children[0];
        this.graded = findChild('sec_graded', txml_raw).children[0] == "1";
        this.status = findChild('sec_status', txml_raw).children[0];
        this.active = findChild('sec_active', txml_raw).children[0] == "1";
        this.meetings = this.parseMeetings(
            findChild('sec_meetings', txml_raw)
        );
    }

    parseInstructors(txml_raw) {
        let temp = [];
        for (let instr of txml_raw.children) {
            temp.push(instr.children[0]);
        }
        return temp;
    }

    parseFinal(txml_raw) {
        return {
            date: findChild('sec_final_date', txml_raw).children[0],
            day_of_week: findChildOrDummy('sec_final_day', txml_raw).children[0],
            time: findChildOrDummy('sec_final_time', txml_raw).children[0]
        };
    }

    parseEnrollment(txml_raw) {
        return {
            max: findChild('sec_max_enroll', txml_raw).children[0],
            enrolled: findChild('sec_enrolled', txml_raw).children[0],
            requests: findChild('sec_enroll_requests', txml_raw).children[0],
            new_only: findChild('sec_new_only_reserved', txml_raw).children[0]
        };
    }

    parseMeetings(txml_raw) {
        let temp = [];
        for (let child of findChildren('sec_meet', txml_raw)) {
            temp.push({
                days: findChild('sec_days', child).children[0],
                time: findChild('sec_time', child).children[0],
                building: findChild('sec_bldg', child).children[0],
                room: findChild('sec_room', child).children[0],
                link: findChild('sec_room_link', child).children[0]
            });
        }
        return temp;
    }
}

class Course {
    constructor(txml_raw) {
        this.number = txml_raw.attributes['course_number'];
        this.title = txml_raw.attributes['course_title'];
        this.sections = this.parseSections(
            findChildren('section', txml_raw)
        );
    }

    parseSections(elements) {
        let temp = [];
        for (let child of elements) {
            temp.push(
                new Section(child)
            );
        }
        return temp;
    }
}

class Department {
    constructor(txml_raw) {
        this.code = txml_raw.attributes['dept_code'];
        this.name = txml_raw.attributes['dept_name'];
        this.case = txml_raw.attributes['dept_case'];
        this.comments = findChildren('department_comment', txml_raw);
        this.courses = this.parseCourses(
            findChildren('course', txml_raw)
        );
    }

    parseCourses(elements) {
        let temp = [];
        for (let child of elements) {
            temp.push(
                new Course(child)
            );
        }
        return temp;
    }
}

class School {
    constructor(txml_raw) {
        this.code = txml_raw.attributes['school_code'];
        this.name = txml_raw.attributes['school_name'];
        this.comments = this.parseComments(findChildren('school_comment', txml_raw));

        this.departments = this.parseDepartments(
            findChildren('department', txml_raw)
        );
    }

    parseComments(elements) {
        let temp = [];
        for (let cmt of elements) {
            temp.push(cmt.children[0]);
        }
        return temp;
    }

    parseDepartments(elements) {
        let temp = [];
        for (let child of elements) {
            temp.push(
                new Department(child)
            );
        }
        return temp;
    }
}

class CourseList {
    constructor(txml_raw) {
        this.schools = this.parseSchools(
            findChildren('school', txml_raw)
        );
    }

    parseSchools(elements) {
        let temp = [];
        for (let child of elements) {
            temp.push(
                new School(child)
            );
        }
        return temp;
    }
}

class WebsocResults {
    constructor(txml_response_raw) {
        this.parse(txml_response_raw[2]);
    }

    parse(txml_raw) {
        this.author = txml_raw.attributes['author'];
        this.generated_at = txml_raw.attributes['generated'];
        this.query_parameters = this.parseQP(txml_raw.attributes['get_parm']);

        let _ct = findChildOrNull('search_criteria', txml_raw);
        this.criterion = _ct ? new SearchCriterion(_ct) : null;
        let _term = findChildOrNull('term', txml_raw);
        this.term = _term ? new Term(_term) : null;
        let _cl = findChildOrNull('course_list', txml_raw);
        this.course_list = _cl ? new CourseList(_cl) : null;
        let _rstr = findChildOrNull('restriction_codes', txml_raw);
        this.restrictions = _rstr ? new Restrictions(_rstr) : null;
    }

    parseQP(raw) {
        let parms = {};
        for (let itm of raw.split("&amp;")) {
            let i = itm.split("=", 2);
            parms[i[0]] = i[1];
        }
        return parms;
    }

    getCourses() {
        let cs = [];
        for (let school of this.course_list.schools) {
            var sClone = {
                ...school,
                departments: undefined
            };

            for (let dept of school.departments) {
                var dClone = {
                    ...dept,
                    courses: undefined
                };

                for (let course of dept.courses) {
                    var cClone = {
                        ...course,
                        school: sClone,
                        department: dClone
                    };

                    cs.push(cClone);
                }
            }
        }
        return cs;
    }
}

module.exports = WebsocResults;
