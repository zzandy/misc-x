import { TextRenderer } from "../text-renderer";

test.each([
    ["Hello $world", "Hello World!"],
    ["Hello $world!!", "Hello World!!!"],
    ["ThisIs${world}Yes", "ThisIsWorld!Yes"]
])("converts placeholder in \"%s\"", (input, expected) => {
    const renderer = new TextRenderer({ world: "World!" });
    const output = renderer.render(input);
    expect(output).toMatch(expected);
});

test("works with functions", () => {
    let n = 0;
    const renderer = new TextRenderer({ world: () => (++n).toString() });

    expect(renderer.render("$world")).toMatch(n.toString());
    expect(renderer.render("$world")).toMatch(n.toString());
    expect(renderer.render("$world")).toMatch(n.toString());
    expect(renderer.render("$world")).toMatch(n.toString());
})