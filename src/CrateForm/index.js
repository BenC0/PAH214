import questions from "./questions.json"

export class CrateForm {
    constructor(options = {}) {
        const {
            variant = null,
            debug = false
        } = options

        this.debug = debug
        this.variant = variant
        this.questions = questions
    }

    init() {
        console.warn({CrateForm: this})
    }

    create_questions_element() {
        // Create the HTML template
    }

    insert_questions_element() {
        // insert the element into the target location
    }

    
}

new CrateForm()