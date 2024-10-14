# Adjusting the size of the images in the README content
readme_content_with_resized_images = """
# Developing Web Applications in JavaScript

![JavaScript Logo](rimg/js.png | width=50) ![CSS Logo](rimg/css.png | width=50) ![HTML Logo](rimg/html.png | width=50)

This repository includes assignments and independent projects from my JavaScript development course. The projects focus on practical JavaScript skills, including DOM manipulation, event handling, and working with the Browser Object Model (BOM). Each project is built using a combination of HTML, CSS, and JavaScript.

## Projects

### 1. BOM, DOM
**Deadline:** 22.10.2024 (7 days)

A task dedicated to understanding and manipulating the Browser Object Model (BOM) and the Document Object Model (DOM). This project emphasizes dynamic page updates using JavaScript and DOM elements.

### 2. Event Handler
**Deadline:** 19.10.2024 (4 days)

This assignment focuses on event-driven programming in JavaScript. It includes handling user interactions, such as mouse clicks and keyboard input, making web pages more interactive and responsive.
"""

# Saving the updated README content with resized images
file_path_resized_images = "/mnt/data/README_with_resized_images.md"
with open(file_path_resized_images, "w") as f:
    f.write(readme_content_with_resized_images)

file_path_resized_images
