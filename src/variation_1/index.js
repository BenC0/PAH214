import "./index.css"
import { Variant } from "../norman"
import { ExtractVariantName } from "../norman/ExtractVariantName"

const conditions = _ => {
    let conditions = [
        !!document.querySelector(`body`),
    ]
    return conditions.every(a => a)
}

function action() {
    this.log("Action loaded")
    console.warn(this)
}

function fallback() {
    this.log("Test can't run, fallback loaded", true)
}

const variation = new Variant(TEST, ExtractVariantName(__dirname), conditions, action, fallback)
variation.run()