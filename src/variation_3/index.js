import "./index.css"
import { Variant } from "../norman"
import { ExtractVariantName } from "../norman/ExtractVariantName"
import { CrateForm } from "../CrateForm"

const conditions = _ => {
    let conditions = [
        !!document.querySelector(`body`),
    ]
    return conditions.every(a => a)
}

function action() {
    this.log("Action loaded")
    console.warn(this)
    let crateForm = new CrateForm({
        debug: true,
        variant: this,
        startActive: false,
        stickyTrigger: true,
        target: ".container-80",
    })
    crateForm.init()
}

function fallback() {
    this.log("Test can't run, fallback loaded", true)
}

const variation = new Variant(TEST, ExtractVariantName(__dirname), conditions, action, fallback)
variation.run()