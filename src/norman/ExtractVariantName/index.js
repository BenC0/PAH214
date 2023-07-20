export function ExtractVariantName(dir = "Variation Name Error") {
    return dir.split("\\").pop()
}

export default ExtractVariantName