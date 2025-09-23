# HTML Semantics Refactoring Exercise

This repository contains an intentionally **non-semantic HTML landing page**.  
The goal of this exercise is for you to **refactor the page** and make it fully semantic, accessible, and logically structured.

---

## 🎯 Objective

- Understand the difference between **semantic** and **non-semantic** HTML.  
- Learn how to use elements like `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<nav>`, `<footer>`, and proper heading hierarchy.  
- Practice improving **accessibility**, **readability**, and **document structure**.

---

## 📝 Instructions

1. Open the file `page.html`.  
2. Carefully read the structure of the page.  
3. Refactor the document by:
   - Replacing `<div>`s with more meaningful tags where appropriate.  
   - Correcting the **heading order** (only one `<h1>` per page, logical nesting with `<h2>`…`<h6>`).  
   - Wrapping related content into `<section>`, `<article>`, `<aside>`, etc.  
   - Using `<header>`, `<nav>`, `<main>`, and `<footer>` correctly.  
   - Restoring missing semantics, such as `<blockquote>`, `<figure>`, `<figcaption>`, `<time>`, `<fieldset>`, `<legend>`, etc.  
   - Fixing lists (`<ul>` vs `<menu>`, proper usage of `<nav>`).  

---

## ✅ Learning Outcomes

After completing the exercise, you should be able to:

- Identify **semantic HTML elements** and when to use them.  
- Structure a web page so that it makes sense both visually and for assistive technologies.  
- Avoid "div soup" by using the correct elements for the right purpose.  
- Build cleaner, more maintainable, and SEO-friendly HTML.  

---

## 🧭 Tips

- Use the [MDN Web Docs — HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements) to look up the correct definitions.  
- Think about the **outline of the page**: which parts are main content, which are secondary?  
- Check your work with an **HTML validator** or accessibility tools, such as:
    - **[W3C Markup Validation Service](https://validator.w3.org/)** – official W3C tool, checks HTML, XHTML, and CSS compliance.  
    - **[Nu Html Checker (v.Nu)](https://validator.w3.org/nu/)** – modern HTML5-focused validator, also from W3C.  
    - **[HTMLHint](https://htmlhint.com/)** – an HTML linter available online or as a CLI tool (`npm install -g htmlhint`).  
    - **[VS Code Extension: HTMLHint](https://marketplace.visualstudio.com/items?itemName=mkaufman.HTMLHint)** – integrates validation directly in your editor.  

    👉 Tip, start with the **W3C Validator**, then try **HTMLHint** for continuous feedback while coding.

    
---

## 📚 Resources

- [MDN HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)  
- [W3C HTML5 Specification](https://www.w3.org/TR/html52/)  
- [WebAIM: Introduction to Web Accessibility](https://webaim.org/intro/)  

---

Happy refactoring! 🎉
