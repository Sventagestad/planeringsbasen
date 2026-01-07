const baseUrl = process.env.CANVAS_BASE_URL ?? "https://canvas.ltu.se/api/v1";
const token = process.env.CANVAS_TOKEN;

if (!token) {
    throw new Error(
        "Missing CANVAS_TOKEN."
    );
}

export const canvasConfig = {
    baseUrl,
    token,
};
