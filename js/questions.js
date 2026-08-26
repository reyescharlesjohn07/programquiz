// Question bank for ProgramQuiz.
// Each question: { q, choices: [4 options], answer: <index of correct choice>, explanation, example }
// `example` is a short code snippet shown after answering, to reinforce the concept visually.
const QUESTIONS = {
  html: {
    easy: [
      {
        q: "What does HTML stand for?",
        choices: ["Hyper Trainer Markup Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Text Markup Leveler"],
        answer: 1,
        explanation: "HTML stands for HyperText Markup Language. It is the standard markup language used to structure content on the web.",
        example: "<!DOCTYPE html>\n<html>\n  <body>\n    <p>Hello, world!</p>\n  </body>\n</html>"
      },
      {
        q: "Which tag defines the largest (most important) heading?",
        choices: ["<h6>", "<heading>", "<h1>", "<head>"],
        answer: 2,
        explanation: "Headings go from <h1> (largest/most important) to <h6> (smallest). Use them in order to keep your page structure meaningful, not just for size.",
        example: "<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<h3>Smaller heading</h3>"
      },
      {
        q: "Which element sets the title shown on the browser tab?",
        choices: ["<header>", "<meta>", "<h1>", "<title>"],
        answer: 3,
        explanation: "<title> lives inside <head> and controls the text shown in the browser tab and search results — it's different from any visible heading on the page.",
        example: "<head>\n  <title>My First Page</title>\n</head>"
      },
      {
        q: "What is the correct HTML element for inserting a line break?",
        choices: ["<break>", "<br>", "<lb>", "<newline>"],
        answer: 1,
        explanation: "<br> inserts a single line break. It's a self-closing (void) element, so it doesn't need a closing tag.",
        example: "<p>Roses are red<br>Violets are blue</p>"
      },
      {
        q: "Which attribute specifies the destination URL of a link?",
        choices: ["src", "link", "href", "url"],
        answer: 2,
        explanation: "The href (hypertext reference) attribute on an <a> tag points to the destination page or resource, e.g. <a href=\"page.html\">.",
        example: "<a href=\"https://example.com\">Visit Example</a>"
      },
      {
        q: "Which tag is used to display an image?",
        choices: ["<image>", "<img>", "<src>", "<picture-src>"],
        answer: 1,
        explanation: "<img> displays an image and requires a src attribute pointing to the file, plus an alt attribute for accessibility.",
        example: "<img src=\"cat.jpg\" alt=\"A sleeping cat\">"
      },
      {
        q: "Which tag creates an unordered (bulleted) list?",
        choices: ["<ol>", "<list>", "<ul>", "<dl>"],
        answer: 2,
        explanation: "<ul> creates a bulleted list; each item goes inside an <li> tag. <ol> is for numbered (ordered) lists instead.",
        example: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>"
      },
      {
        q: "Which tag defines a paragraph of text?",
        choices: ["<p>", "<para>", "<text>", "<pg>"],
        answer: 0,
        explanation: "<p> defines a paragraph. Browsers automatically add spacing before and after it.",
        example: "<p>This is a paragraph of text.</p>"
      },
      {
        q: "What is the correct syntax for an HTML comment?",
        choices: ["// comment", "<!-- comment -->", "/* comment */", "# comment"],
        answer: 1,
        explanation: "HTML comments are written as <!-- comment -->. They are ignored by the browser and useful for leaving notes in your code.",
        example: "<!-- This note won't show on the page -->\n<p>Visible text</p>"
      },
      {
        q: "Which line correctly declares an HTML5 document?",
        choices: ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<DOCTYPE html>", "<!doctype HTML PUBLIC>"],
        answer: 0,
        explanation: "<!DOCTYPE html> is the simple, case-insensitive doctype used for HTML5. It must be the very first line of the document.",
        example: "<!DOCTYPE html>\n<html lang=\"en\">\n  <head><title>Page</title></head>\n  <body></body>\n</html>"
      }
    ],
    medium: [
      {
        q: "Which attribute uniquely identifies a single HTML element on a page?",
        choices: ["class", "name", "id", "key"],
        answer: 2,
        explanation: "id must be unique within the page and is often used as a hook for CSS or JavaScript. class, on the other hand, can be reused on many elements.",
        example: "<h2 id=\"intro\">Introduction</h2>\n\n/* CSS */\n#intro {\n  color: navy;\n}"
      },
      {
        q: "Which attribute/value makes a link open in a new browser tab?",
        choices: ["target=\"_new\"", "target=\"_blank\"", "rel=\"new\"", "open=\"tab\""],
        answer: 1,
        explanation: "target=\"_blank\" opens the linked page in a new tab or window. It's good practice to pair it with rel=\"noopener noreferrer\" for security.",
        example: "<a href=\"https://example.com\" target=\"_blank\" rel=\"noopener\">Open in new tab</a>"
      },
      {
        q: "Which tag defines a row inside an HTML table?",
        choices: ["<td>", "<th>", "<tr>", "<table>"],
        answer: 2,
        explanation: "<tr> (table row) holds a set of <td> (data cell) or <th> (header cell) elements.",
        example: "<table>\n  <tr>\n    <td>Row 1, Cell 1</td>\n    <td>Row 1, Cell 2</td>\n  </tr>\n</table>"
      },
      {
        q: "Which tag defines a header cell in a table?",
        choices: ["<th>", "<td>", "<head>", "<tr>"],
        answer: 0,
        explanation: "<th> marks a cell as a header — browsers bold and center it by default, and it improves accessibility for screen readers.",
        example: "<table>\n  <tr>\n    <th>Name</th>\n    <th>Grade</th>\n  </tr>\n  <tr>\n    <td>Juan</td>\n    <td>95</td>\n  </tr>\n</table>"
      },
      {
        q: "In an HTML <form>, what does the `action` attribute specify?",
        choices: ["The visual style of the form", "Where the form data is submitted to", "The name of the form", "Which fields are required"],
        answer: 1,
        explanation: "action holds the URL that will receive the submitted form data. The `method` attribute (GET or POST) controls how it's sent.",
        example: "<form action=\"/submit\" method=\"post\">\n  <input type=\"text\" name=\"username\">\n  <button type=\"submit\">Send</button>\n</form>"
      },
      {
        q: "Which input type hides the characters a user types, for a password field?",
        choices: ["text", "hidden", "password", "secret"],
        answer: 2,
        explanation: "<input type=\"password\"> masks each character as it's typed. type=\"hidden\" is unrelated — it hides the whole field from view, not just the text.",
        example: "<input type=\"password\" name=\"pwd\" placeholder=\"Enter password\">"
      },
      {
        q: "Which HTML5 element represents self-contained content, like a blog post or news story?",
        choices: ["<section>", "<div>", "<article>", "<aside>"],
        answer: 2,
        explanation: "<article> is meant for content that could stand alone and be redistributed independently (a post, a comment, a product card).",
        example: "<article>\n  <h2>Blog Post Title</h2>\n  <p>Post content goes here...</p>\n</article>"
      },
      {
        q: "Which HTML5 element is meant for a block of navigation links?",
        choices: ["<menu>", "<nav>", "<links>", "<navigate>"],
        answer: 1,
        explanation: "<nav> semantically marks the main navigation links of a page, helping both browsers and assistive technology identify them.",
        example: "<nav>\n  <a href=\"index.html\">Home</a>\n  <a href=\"about.html\">About</a>\n</nav>"
      },
      {
        q: "Which statement about <div> and <span> is correct?",
        choices: ["<div> is block-level and <span> is inline", "Both are inline elements", "Both are block-level elements", "<span> is block-level and <div> is inline"],
        answer: 0,
        explanation: "<div> is a generic block-level container (starts on a new line, takes full width), while <span> is a generic inline container used within text.",
        example: "<div>This is a block-level box.</div>\n<span>This is inline text.</span>"
      },
      {
        q: "Which character entity represents a non-breaking space?",
        choices: ["&space;", "&nbsp;", "&sp;", "&nbspc;"],
        answer: 1,
        explanation: "&nbsp; inserts a space that browsers won't collapse or use as a line-break point, useful for keeping two words together.",
        example: "<p>Click&nbsp;Here</p>"
      }
    ],
    hard: [
      {
        q: "A user clicks submit without typing anything into this field. What happens?",
        code: "<input type=\"text\" name=\"email\" required>",
        choices: ["The form submits normally with an empty value", "The browser blocks submission and shows a validation message", "The page reloads and clears the whole form", "A JavaScript error is thrown in the console"],
        answer: 1,
        explanation: "The required boolean attribute triggers built-in browser validation, blocking submission and showing a message like \"Please fill out this field\" until the field has a value."
      },
      {
        q: "This image tag is missing something important for accessibility. What's the fix?",
        code: "<img src=\"chart.png\">",
        choices: ["Add a width attribute", "Add an alt attribute describing the image", "Wrap it in a <figure> tag", "Nothing — this is already correct"],
        answer: 1,
        explanation: "alt text is read aloud by screen readers and shown if the image fails to load — essential for accessibility and SEO. Without it, screen reader users get no information about the image."
      },
      {
        q: "Which semantic element is missing here to properly wrap the page's primary, unique content?",
        code: "<body>\n  <header>Site Header</header>\n  <section>\n    <h1>Page Content</h1>\n  </section>\n  <footer>Site Footer</footer>\n</body>",
        choices: ["<article> around the <section>", "<main> around the <section>", "A plain <div> around the <section>", "Nothing is missing"],
        answer: 1,
        explanation: "<main> should wrap the primary content of the page (excluding header/nav/footer) and should appear once per page — it helps screen reader users jump straight to the important content."
      },
      {
        q: "This button closes a modal but has no visible text, only an ×. What should be added so screen reader users know what it does?",
        code: "<button>&times;</button>",
        choices: ["title=\"Close\"", "aria-label=\"Close\"", "alt=\"Close\"", "data-label=\"Close\""],
        answer: 1,
        explanation: "aria-label gives the button an accessible name that screen readers announce reliably. alt is only valid on elements like <img>, not <button>, and title support for accessibility is inconsistent."
      },
      {
        q: "Mobile users report the page renders tiny and zoomed out. Which tag is missing from <head> to fix this?",
        code: "<head>\n  <title>My Page</title>\n</head>",
        choices: ["<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "<meta charset=\"UTF-8\">", "<link rel=\"stylesheet\" href=\"style.css\">", "<meta name=\"mobile\" content=\"true\">"],
        answer: 0,
        explanation: "The viewport meta tag tells the browser to match the page width to the device width and set the initial zoom level — without it, mobile browsers render at a fixed desktop width and zoom out."
      },
      {
        q: "The team wants to move these styles into a reusable style.css file instead of this inline block. Which line correctly does that?",
        code: "<head>\n  <style>\n    body { color: black; }\n  </style>\n</head>",
        choices: ["<script src=\"style.css\">", "<link rel=\"stylesheet\" href=\"style.css\">", "<style href=\"style.css\">", "<css src=\"style.css\">"],
        answer: 1,
        explanation: "<link rel=\"stylesheet\" href=\"...\"> inside <head> is the standard way to attach an external stylesheet, so the same file can be reused across multiple pages."
      },
      {
        q: "You want the cursor already blinking in this search box the instant the page loads, without using JavaScript. Which attribute should you add?",
        code: "<form>\n  <input type=\"text\" name=\"search\">\n</form>",
        choices: ["focus", "default", "autofocus", "autostart"],
        answer: 2,
        explanation: "The autofocus boolean attribute places the cursor in that field as soon as the page finishes loading — no script required."
      },
      {
        q: "You need to store this user's numeric ID (42) directly on the <li>, so JavaScript can read it later without a lookup. What's the standard HTML5 way to do it?",
        code: "<li>Juan Dela Cruz</li>",
        choices: ["<li id=\"42\">Juan Dela Cruz</li>", "<li data-user-id=\"42\">Juan Dela Cruz</li>", "<li value=\"42\">Juan Dela Cruz</li>", "<li user-id=\"42\">Juan Dela Cruz</li>"],
        answer: 1,
        explanation: "Custom data-* attributes are the standards-compliant way to attach extra information to an element — readable in JS via element.dataset.userId. Plain id is meant to uniquely identify the element itself, not carry arbitrary data."
      },
      {
        q: "Users report they can't play, pause, or adjust volume — there's no player UI at all. What's missing?",
        code: "<video src=\"demo.mp4\"></video>",
        choices: ["The autoplay attribute", "The controls attribute", "The loop attribute", "A separate <source> tag"],
        answer: 1,
        explanation: "The controls attribute tells the browser to show its built-in play/pause/volume/seek UI. Without it, the video exists but offers no way to interact with it."
      },
      {
        q: "Special characters like ñ and é are showing up as garbled symbols (mojibake) in the browser tab. What's the most likely fix?",
        code: "<head>\n  <title>My Page &mdash; ñáéíóú</title>\n</head>",
        choices: ["Add <meta charset=\"UTF-8\"> as the first tag inside <head>", "Rename the file to use a .html extension", "Add a <!DOCTYPE html> declaration", "Replace the accented letters with &amp;"],
        answer: 0,
        explanation: "UTF-8 covers virtually every character used worldwide. Declaring <meta charset=\"UTF-8\"> early (before any text content) prevents the browser from misreading bytes before it commits to an encoding."
      }
    ]
  },
  css: {
    easy: [
      {
        q: "What does CSS stand for?",
        choices: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Cascading Simple Sheets"],
        answer: 0,
        explanation: "CSS stands for Cascading Style Sheets. It describes how HTML elements should be displayed — layout, colors, fonts, and more.",
        example: "p {\n  color: blue;\n}"
      },
      {
        q: "Which tag is used to link an external CSS file to an HTML page?",
        choices: ["<style>", "<script>", "<link>", "<css>"],
        answer: 2,
        explanation: "<link rel=\"stylesheet\" href=\"file.css\"> in the <head> connects an external stylesheet to your HTML.",
        example: "<head>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>"
      },
      {
        q: "Which CSS property changes the color of text?",
        choices: ["text-color", "font-color", "color", "background-color"],
        answer: 2,
        explanation: "The `color` property sets the color of an element's text. `background-color` instead sets the color behind it.",
        example: "h1 {\n  color: crimson;\n}"
      },
      {
        q: "Which CSS property changes an element's background color?",
        choices: ["bg-color", "color", "background-color", "background"],
        answer: 2,
        explanation: "background-color sets just the background color. (The shorthand `background` can also do this plus images, position, etc.)",
        example: "body {\n  background-color: #f0f0f0;\n}"
      },
      {
        q: "How do you select the element with id=\"demo\" in CSS?",
        choices: ["demo {}", ".demo {}", "#demo {}", "*demo {}"],
        answer: 2,
        explanation: "The # symbol targets an element by its id. The . symbol is used for class selectors instead.",
        example: "<p id=\"demo\">Hello</p>\n\n/* CSS */\n#demo {\n  font-weight: bold;\n}"
      },
      {
        q: "How do you select all elements with class=\"test\" in CSS?",
        choices: ["#test {}", ".test {}", "test {}", "*test {}"],
        answer: 1,
        explanation: "The . symbol selects elements by class, and a class can be applied to many elements at once — unlike an id, which should be unique.",
        example: "<p class=\"test\">Styled text</p>\n\n/* CSS */\n.test {\n  color: green;\n}"
      },
      {
        q: "Which CSS property controls the size of text?",
        choices: ["text-size", "font-size", "size", "font-style"],
        answer: 1,
        explanation: "font-size sets how large the text renders, commonly in px, em, or rem units.",
        example: "p {\n  font-size: 18px;\n}"
      },
      {
        q: "Which of these is valid CSS syntax?",
        choices: ["body {color: black;}", "{body:color=black}", "body:color=black(black)", "{body;color:black;}"],
        answer: 0,
        explanation: "CSS rules follow the pattern: selector { property: value; }. Here, `body` is the selector, `color` the property, `black` the value.",
        example: "body {\n  color: black;\n}"
      },
      {
        q: "Where can CSS be added to an HTML document?",
        choices: ["Inline (style attribute)", "Internal (<style> block)", "External (linked .css file)", "All of the above"],
        answer: 3,
        explanation: "CSS can be inline, internal, or external. External stylesheets are usually preferred because they keep styling separate and reusable across pages.",
        example: "<p style=\"color:red;\">Inline</p>\n\n<style>\n  p { color: blue; }\n</style>\n\n<link rel=\"stylesheet\" href=\"style.css\">"
      },
      {
        q: "Which property changes the font used for an element's text?",
        choices: ["font-family", "text-style", "font-type", "font"],
        answer: 0,
        explanation: "font-family lists the typeface(s) to use, e.g. font-family: Arial, sans-serif; — later fonts act as fallbacks.",
        example: "body {\n  font-family: Arial, sans-serif;\n}"
      }
    ],
    medium: [
      {
        q: "In the CSS box model, what is the correct order from innermost to outermost?",
        choices: ["Content → Padding → Border → Margin", "Content → Border → Padding → Margin", "Margin → Border → Padding → Content", "Padding → Content → Border → Margin"],
        answer: 0,
        explanation: "Every box is built as Content, then Padding around it, then a Border, then Margin as the outermost space separating it from other elements.",
        example: "div {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n  margin: 10px;\n}"
      },
      {
        q: "What is the difference between margin and padding?",
        choices: ["They are the same thing", "Padding is space inside the border (around content); margin is space outside the border (between elements)", "Margin is inside the border; padding is outside", "Padding only works on text, margin only works on boxes"],
        answer: 1,
        explanation: "Padding sits between the content and the border (inside the box); margin sits outside the border and creates space between this element and its neighbors.",
        example: ".box {\n  padding: 20px;  /* inside the border, around content */\n  margin: 20px;   /* outside the border, between elements */\n  border: 2px solid #333;\n}"
      },
      {
        q: "Which CSS property makes text bold?",
        choices: ["text-bold", "font-weight", "font-style", "bold"],
        answer: 1,
        explanation: "font-weight controls boldness, e.g. font-weight: bold; or a numeric value like 700.",
        example: "strong {\n  font-weight: bold;\n}"
      },
      {
        q: "Which `display` value removes an element from the layout completely, as if it wasn't there?",
        choices: ["visibility: hidden", "display: none", "opacity: 0", "display: invisible"],
        answer: 1,
        explanation: "display: none removes the element and its space entirely. visibility: hidden hides it visually but still reserves its space in the layout.",
        example: ".gone {\n  display: none;         /* removed, no space left behind */\n}\n.invisible {\n  visibility: hidden;    /* hidden, but space stays */\n}"
      },
      {
        q: "Which layout mode uses `display: flex` along with properties like justify-content and align-items?",
        choices: ["Grid", "Float", "Flexbox", "Table"],
        answer: 2,
        explanation: "Flexbox arranges items in a single row or column and gives you easy control over alignment, spacing, and ordering.",
        example: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
      },
      {
        q: "Which CSS unit is relative to the font-size of the root (<html>) element?",
        choices: ["em", "px", "rem", "%"],
        answer: 2,
        explanation: "rem (\"root em\") is always relative to the root element's font-size, which makes sizing more predictable than `em`, which is relative to its parent.",
        example: "html {\n  font-size: 16px;\n}\nh1 {\n  font-size: 2rem; /* = 32px, always based on root */\n}"
      },
      {
        q: "Which pseudo-class selects a link the user has already visited?",
        choices: [":link", ":hover", ":visited", ":active"],
        answer: 2,
        explanation: ":visited styles links the browser knows the user has already clicked, often shown in a different color.",
        example: "a:visited {\n  color: purple;\n}"
      },
      {
        q: "Which pseudo-class applies a style while the mouse pointer is over an element?",
        choices: [":hover", ":focus", ":active", ":visited"],
        answer: 0,
        explanation: ":hover triggers styling on mouseover. :active applies only while the element is being clicked/pressed, and :focus applies when it has keyboard focus.",
        example: "button:hover {\n  background-color: lightblue;\n}"
      },
      {
        q: "Which CSS property controls the vertical spacing between lines of text?",
        choices: ["letter-spacing", "word-spacing", "line-height", "text-indent"],
        answer: 2,
        explanation: "line-height sets the height of each line box, which controls the visual gap between wrapped lines of text.",
        example: "p {\n  line-height: 1.6;\n}"
      },
      {
        q: "What does `position: relative` do to an element?",
        choices: ["Positions it relative to the viewport, removing it from flow", "Positions it relative to its nearest positioned ancestor", "Keeps it in normal flow, but lets you nudge it with top/left/right/bottom relative to its own original position", "It has no visual effect at all"],
        answer: 2,
        explanation: "A relatively positioned element still takes up its original space in the layout; top/left/right/bottom then shift it visually from that original position.",
        example: ".box {\n  position: relative;\n  top: 10px;\n  left: 20px;\n}"
      }
    ],
    hard: [
      {
        q: "With box-sizing: border-box applied, what is the actual rendered total width of .card (content + padding + border)?",
        code: "* {\n  box-sizing: border-box;\n}\n.card {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #333;\n}",
        choices: ["200px", "250px", "210px", "150px"],
        answer: 0,
        explanation: "With border-box, the padding and border are drawn inside the declared width instead of adding to it — so .card renders at exactly 200px total, not 200px of content plus extra."
      },
      {
        q: "Given these rules, what color will the paragraph's text actually render as?",
        code: "#note { color: green; }\n.text { color: blue; }\n\n<p id=\"note\" class=\"text\" style=\"color: red;\">Text</p>",
        choices: ["Blue, because the .text rule is declared last", "Green, because ID selectors beat class selectors", "Red, because inline styles win over both", "Black, the conflicting rules cancel out"],
        answer: 2,
        explanation: "Specificity ranking from lowest to highest is: element < class < ID < inline style. The inline style=\"color: red\" always wins over both the #note and .text rules, regardless of source order."
      },
      {
        q: "This grid container is 900px wide (ignoring gaps for simplicity). Roughly how wide does each column render?",
        code: ".grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n}",
        choices: ["900px each", "300px each", "100px each", "It's undefined — fr units require a fixed value first"],
        answer: 1,
        explanation: "grid-template-columns: 1fr 1fr 1fr splits the available width into three equal shares. 900px split three ways is 300px per column."
      },
      {
        q: ".badge is supposed to render above its sibling elements, but it's still appearing underneath one. Based on this rule alone, what's most likely missing?",
        code: ".badge {\n  z-index: 10;\n  background: gold;\n}",
        choices: ["A higher z-index value, like 9999", "A `position` value other than static (e.g. relative)", "A background-color", "A margin value"],
        answer: 1,
        explanation: "z-index only affects stacking order on positioned elements (position: relative/absolute/fixed/sticky). Without a position value, .badge is still static and z-index is silently ignored."
      },
      {
        q: "Which block correctly makes body's font-size drop to 14px only on screens 600px wide or smaller?",
        code: "body {\n  font-size: 16px;\n}",
        choices: [
          "@media (max-width: 600px) {\n  body { font-size: 14px; }\n}",
          "@import (max-width: 600px) {\n  body { font-size: 14px; }\n}",
          "body {\n  @media (max-width: 600px) {\n    font-size: 14px;\n  }\n}",
          "@screen (max-width: 600px) {\n  body { font-size: 14px; }\n}"
        ],
        answer: 0,
        explanation: "@media queries wrap normal CSS rules and only apply them when the condition is met. @import and @screen aren't valid for this, and a @media block can't be nested inside a property declaration like that."
      },
      {
        q: "The design team wants to change the brand color everywhere at once. Given this CSS, what's the minimum change needed?",
        code: ":root {\n  --main-color: #4f46e5;\n}\nh1 {\n  color: var(--main-color);\n}\nbutton {\n  background-color: var(--main-color);\n}",
        choices: ["Edit only the --main-color value inside :root", "Edit the color value in both the h1 and button rules separately", "Rename var(--main-color) in every rule", "Add !important to both rules"],
        answer: 0,
        explanation: "Because both rules reference var(--main-color), changing the single custom property definition in :root updates every rule that uses it — that's the whole point of CSS variables."
      },
      {
        q: "If .parent did NOT have position: relative, where would .child position itself relative to instead?",
        code: ".parent {\n  position: relative;\n}\n.child {\n  position: absolute;\n  top: 0;\n  right: 0;\n}",
        choices: ["It simply wouldn't display", "The nearest positioned ancestor further up the DOM, or the page itself if none exists", "Its own original position in normal flow", "The exact center of the screen"],
        answer: 1,
        explanation: "position: absolute always positions relative to the closest ancestor with a non-static position. If .parent isn't positioned, the browser keeps looking up the DOM tree until it finds one, or falls back to the initial containing block (the page)."
      },
      {
        q: "As the user scrolls the page down, how does .nav behave?",
        code: ".nav {\n  position: sticky;\n  top: 0;\n}",
        choices: ["It's fixed to the screen from the very start of the page", "It scrolls normally until it reaches the top of the viewport, then sticks there", "It disappears once scrolled past", "It behaves exactly like position: absolute"],
        answer: 1,
        explanation: "A sticky element scrolls normally with the page until it hits the specified offset (top: 0 here), then stays pinned in place until its container scrolls out of view."
      },
      {
        q: "What happens visually when a user's mouse moves over this button?",
        code: "button {\n  background-color: indigo;\n  transition: background-color 0.3s ease;\n}\nbutton:hover {\n  background-color: violet;\n}",
        choices: ["The color changes instantly, with no animation", "The background smoothly fades from indigo to violet over 0.3 seconds", "The button's size changes", "Nothing happens until the button is clicked"],
        answer: 1,
        explanation: "transition: background-color 0.3s ease animates that property over 0.3 seconds whenever it changes — including on :hover — instead of switching instantly."
      },
      {
        q: "What color will this heading render as?",
        code: "#header { color: red; }\n.title { color: blue; }\n\n<h1 id=\"header\" class=\"title\">Welcome</h1>",
        choices: ["Blue, because .title is declared after #header", "Red, because ID selectors have higher specificity than class selectors", "Black, the browser default", "It alternates between red and blue"],
        answer: 1,
        explanation: "A common specificity model scores IDs around 100 points and classes around 10 — the ID selector wins regardless of source order, so the heading renders red."
      }
    ]
  }
};

// Point value awarded per difficulty level.
const POINTS = { easy: 1, medium: 2, hard: 3 };
const ROUND_ORDER = ["easy", "medium", "hard"];
