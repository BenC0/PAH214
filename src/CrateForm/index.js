import "./index.css"
import { TestElement, getHighestZIndex, watchForChange } from "../norman"
import questions from "./questions.json"

export class CrateForm extends TestElement {
    constructor(options = {}) {
        const {
            variant = null,
            debug = false,
            target = null,
            targetMethod = "afterBegin",
            stickyTrigger = false,
            startActive = false,
        } = options
        
        super(`<section class="crateForm" test="${variant.id}"></section>`)
        
        this.config = {}
        this.config.debug = debug
        this.config.target = target
        this.config.variant = variant
        this.config.startActive = startActive
        this.config.stickyTrigger = stickyTrigger
        this.config.targetMethod = targetMethod
        
        this.answers = {}
        this.triggers = []
        this.questions = []
        this.applying_filters = false
        const sort_by_id = (a, b) => a.id - b.id
        this.config.questions = questions.sort(sort_by_id)
        this.config.questions.map(q => q.options.sort(sort_by_id))
    }

    init() {
        this.create()
        this.insert()
        this.override_filter()
        
        this.triggers.forEach(trigger => {
            this.config.debug && console.warn({
                "message": "Applying toggle click event to trigger",
                "element": trigger
            }) 
            trigger.node.addEventListener("click", e => {
                this.toggle()
            })
        })

        this.questions.forEach(question => {
            question.node.querySelectorAll(".option").forEach(option => {
                option.addEventListener("click", e => {
                    this.option_selection_handler(question, option)
                })
            })
        })
        if (this.config.startActive) {
            this.toggle()
        }
        if (this.config.stickyTrigger) {
            this.show_sticky_trigger()
            let close_icons = this.sticky_trigger_container.node.querySelectorAll(".close_icon")
            close_icons.forEach(close_icon => {
                close_icon.addEventListener("click", e=> {
                    this.config.debug && console.warn({
                        "message": "Applying hide click event to sticky close trigger",
                        "element": close_icon
                    }) 
                    this.hide_sticky_trigger()
                })
            })
        }

        let productListNavigation_controller = document.querySelector(`[controllerid="productListNavigation_controller"]`)
        if(!!productListNavigation_controller) {
            watchForChange(
                productListNavigation_controller,
                _ => {
                    this.config.debug && console.warn({
                        "message": "Mutation on 'productListNavigation_controller' detected",
                    }) 
                    this.reset_load_state()
                },
                {
                    childList: true,
                    subtree: false,
                    attributes: false
                },
                `${this.config.variant.id}__observer`,
            )
        }

        this.config.debug && console.warn({CrateForm: this})
    }

    set_load_state() {
        this.config.debug && console.warn({
            "message": "Setting load state",
            "this.applying_filters (new)": true,
            "this.applying_filters (current)": this.applying_filters,
        }) 
        this.applying_filters = true
    }

    reset_load_state() {
        this.config.debug && console.warn({
            "message": "Resetting load state",
            "this.applying_filters (new)": false,
            "this.applying_filters (current)": this.applying_filters,
        }) 
        this.applying_filters = false
    }

    override_filter() {
        let original_ui_filter = ui.filter
        ui.filter = (e) => {
            console.warn({
                "msg": "ui.filter called",
                "event": e,
            })
            if(!this.applying_filters) {
                original_ui_filter(e)
            }
        }
    }

    option_selection_handler(question, option) {
        let question_value = question.node.getAttribute("data-filter")
        let option_value = option.getAttribute("data-values").split(",")
        this.answers[question_value] = option_value
        this.config.debug && console.warn({
            "Updated": question_value,
            "Value": option_value,
            "Answers": this.answers,
            "Function": "option_selection_handler",
        })
        this.next_question(question)
    }

    next_question(current_question) {
        current_question._class("complete")
        current_question._class("active", false)
        let next_question = current_question.node.nextElementSibling
        if (!!next_question && next_question.classList.contains("crateForm__results")) {
            next_question = "results"
        } else if (next_question === null) {
            next_question = "results"
        }
        this.config.debug && console.warn({
            next_question
        })
        if (next_question == "results") {
            this.show_results()
        } else {
            next_question.classList.add("active")
        }
    }

    show_results() {
        this.config.debug && console.warn({
            "function": "show_results",
            "answers": this.answers,
        })
        for (const filter in this.answers) {
            if (Object.hasOwnProperty.call(this.answers, filter)) {
                const answers = this.answers[filter]
                this.stage_filter(filter, answers)
            }
        }
        this.apply_filters()
        this._class("results")
        this.results._class("active")
    }

    stage_filter(filter, answers) {
        this.config.debug && console.warn({
            "function": "stage_filter",
            filter,
            answers,
        })
        let filter_el = document.querySelector(`#facetId${filter}`)
        let alt_filter = filter.replace(/_/g, " ")
        answers.forEach(answer => {
            let answer_el = filter_el.querySelector(`[title="${answer}"], [facet-data='${filter}="${answer}"'], [facet-data='${alt_filter}="${answer}"']`)
            this.config.debug && console.warn({
                "function": "staging_filter",
                filter,
                answer,
                answer_el,
            })
            answer_el.nextElementSibling.checked = true
            answer_el.nextElementSibling.setAttribute("checked", "checked")
            answer_el.querySelectorAll("li").forEach(e => e.classList.add("active"))
        })
    }

    apply_filters() {
        this.config.debug && console.warn({
            "function": "apply_filters"
        })
        this.set_load_state()
        SearchBasedNavigationDisplayJS.doSearchFilter()
    }

    toggle() {
        let activate = !this.node.classList.contains("active")
        this.config.debug && console.warn({
            activate,
            "function": "toggle",
        })
        this._class("active", activate)
    }

    create() {
        // Create the HTML templates
        this.questions_html = []
        this.config.questions.forEach(question => {
            let html = this.create_question(question)
            this.questions_html.push(html)
        })
        this.trigger_html = this.create_trigger()
        this.results_html = this.create_results()
        if (this.config.stickyTrigger) {
            this.sticky_trigger_html = this.create_sticky_trigger()
        }
    }
    
    insert() {
        // insert the element into the target location
        if (!!this.config.target) {
            this._insert(this.config.target, this.config.targetMethod)
            this._append(this.trigger_html)
            this.trigger = new TestElement(".crateForm__trigger")
            this.triggers.push(this.trigger)
            this.questions_html.forEach(question => {
                this._append(question)
            })
            this._append(this.results_html)
            this.results = new TestElement(".crateForm__results")
            this.questions = this._find(".question")
            this.questions[0]._class("active")

            if (this.config.stickyTrigger) {
                document.body.insertAdjacentHTML("beforeEnd", this.sticky_trigger_html)
                this.sticky_trigger = new TestElement(".crateForm__sticky_trigger")
                this.sticky_trigger_container = new TestElement(".crateForm__sticky_trigger_container")
                this.triggers.push(this.sticky_trigger)
            }
        }
    }

    create_question(question) {
        // Create the HTML template for an individual question
        let options = []
        question.options.forEach(option => {
            options.push(this.create_option(option))
        }) 
        return `<div class="question" data-filter="${question.filter}" data-question="${question.id}">
            <div class="title">
                <p class="text"> ${question.question} </p>
            </div>
            <div class="options"> ${options.join(" ")} </div>
        </div>`
    }

    create_option(option) {
        // Create the HTML template for an individual option
        return `<div class="option" data-values="${option.values.join(",")}">
            <img class="image" src="${option.img}" alt="${option.name}" />
            <p class="text">${option.name}</p>
        </div>`
    }

    create_trigger() {
        return `<div class="crateForm__trigger" test="${this.config.variant.id}">
            <p class="text">Find the right crate for you</p>
            <svg class="toggle_icon" width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.94 0.459179C5.79356 0.459179 0.00019455 6.25255 0.00019455 13.399C0.00019455 20.5455 5.79356 26.3389 12.94 26.3389C20.0865 26.3389 25.8799 20.5455 25.8799 13.399C25.8799 6.25255 20.0865 0.459179 12.94 0.459179Z" fill="#002828"/>
                <path d="M11.7914 16.9925V14.0707H8.97039V11.6527H11.7914V8.731H14.3101V11.6527H17.1311V14.0707H14.3101V16.9925H11.7914Z" fill="#FFFAF5"/>
            </svg>
        </div>`
    }

    create_results() {
        return `<div class="crateForm__results" test="${this.config.variant.id}">
            <p class="text">All done! Here are your results</p>
            <svg class="results_icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0332 -0.000146866C6.28294 -0.000146866 7.24792e-05 6.28276 7.24792e-05 14.0331C7.24792e-05 21.7835 6.28294 28.0664 14.0332 28.0664C21.7835 28.0664 28.0664 21.7835 28.0664 14.0331C28.0664 6.28276 21.7835 -0.000146866 14.0332 -0.000146866Z" fill="#002828"/>
                <path d="M8.80023 11.2266L13.9532 16.0879L19.1062 11.2266L20.6891 12.7305L13.9532 19.0852L7.21729 12.7305L8.80023 11.2266Z" fill="#FFFAF5"/>
            </svg>
        </div>`
    }

    create_sticky_trigger() {
        return `<div class="crateForm__sticky_trigger_container" test="${this.config.variant.id}" style="z-index: ${getHighestZIndex() + 1};">
            <div class="crateForm__sticky_trigger">
                <img src="https://editor-assets.abtasty.com/47297/64bf91a76ab141690276263.png" />
                <p class="text">Find the right crate for you</p>
            </div>
            <svg class="close_icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8921 0C4.87659 0 4.95911e-05 4.87645 4.95911e-05 10.8918C4.95911e-05 16.9072 4.87659 21.7837 10.8921 21.7837C16.9076 21.7837 21.7842 16.9072 21.7842 10.8918C21.7842 4.87645 16.9076 0 10.8921 0Z" fill="#00AA28"/>
                <path d="M7.39373 14.2979L9.68581 10.7069L7.54653 7.26879H9.83862L10.9847 9.25527L12.1307 7.26879H14.4228L12.2835 10.7069L14.5756 14.2979H12.2835L10.9847 12.1586L9.68581 14.2979H7.39373Z" fill="#FFFAF5"/>
            </svg>
        </div>`
    }

    show_sticky_trigger() {
        this.sticky_trigger_container._class("active", true)
    }

    hide_sticky_trigger() {
        this.sticky_trigger_container._class("active", false)
    }
}