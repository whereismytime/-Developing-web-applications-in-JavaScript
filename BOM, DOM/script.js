// Task 1
const slider = document.querySelector('.slider');
const initialValue = slider.value;

slider.style.background = `linear-gradient(to right, blue ${initialValue}%, #ddd ${initialValue}%)`;

slider.addEventListener('input', function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, blue ${value}%, #ddd ${value}%)`;
});


// Task 2
const images = ["./img/img1.jpg", "./img/img2.jpg", "./img/img3.jpg", "./img/img4.jpg"];
let currentIndex = 0;

const imgElement = document.getElementById("gallery-image");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");


function updateGallery() {
    imgElement.src = images[currentIndex];
    prevButton.disabled = currentIndex === 0; 
    nextButton.disabled = currentIndex === images.length - 1; 
}

prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
    }
});

nextButton.addEventListener("click", () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateGallery();
    }
});


updateGallery();

// Task 3
const headers = document.querySelectorAll('.accordion-header');
let activeIndex = null;


headers.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const currentIndex = header.getAttribute('data-id');

        
        if (activeIndex !== null && activeIndex !== currentIndex) {
            document.querySelector(`.accordion-header[data-id="${activeIndex}"]`).nextElementSibling.style.display = 'none';
        }

        
        if (content.style.display === 'block') {
            content.style.display = 'none';
            activeIndex = null;
        } else {
            content.style.display = 'block';
            activeIndex = currentIndex;
        }
    });
});

// Task 4
const newsArray = [
    { title: 'The second news', content: 'This is the text of the second news item.' },
    { title: 'The third news', content: 'This is the text of the third news item.' },
    { title: 'The fourth news', content: 'This is the text of the fourth news item.' },
    { title: "The fifth news", content: "This is the text of the fifth news item." }
];
let newsIndex = 0;

const newsContainer = document.getElementById('news-container');
const loadingIndicator = document.getElementById('loading');
let noMoreNewsDisplayed = false;


function loadNews() {
    if (newsIndex >= newsArray.length) {
        if (!noMoreNewsDisplayed) {
            noMoreNews(); 
            noMoreNewsDisplayed = true;
        }
        return;
    }

    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');

    const newsTitle = document.createElement('h3');
    newsTitle.innerText = newsArray[newsIndex].title;
    
    const newsContent = document.createElement('p');
    newsContent.innerText = newsArray[newsIndex].content;

    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsContent);
    newsContainer.appendChild(newsItem);

    newsIndex++;
}


function handleScroll() {
    if (newsContainer.scrollTop + newsContainer.clientHeight >= newsContainer.scrollHeight - 5) {
        loadingIndicator.style.display = 'block';
        setTimeout(() => {
            loadNews();
            loadingIndicator.style.display = 'none';
        }, 1000); 
    }
}


function noMoreNews() {
    loadingIndicator.style.display = 'none'; 
    const noMoreNewsMessage = document.createElement('p');
    noMoreNewsMessage.innerText = 'Більше новин на сьогодні немає.';
    noMoreNewsMessage.style.textAlign = 'center';
    noMoreNewsMessage.style.fontWeight = 'bold';
    noMoreNewsMessage.classList.add('no-more-news');
    newsContainer.appendChild(noMoreNewsMessage);
}


newsContainer.addEventListener('scroll', handleScroll);

// Task 5
document.getElementById('generate').addEventListener('click', generateCalendar);

function generateCalendar() {
    let month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

   
    if (month < 1) month = 1;
    if (month > 12) month = 12;

    if (year < 1920) year = 1920;
    if (year > 2050) year = 2050;

    
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const calendarTitle = document.getElementById('calendar-title');
    calendarTitle.textContent = `${firstDay.toLocaleString('default', { month: 'long' })}, ${year}`;

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    
    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let headerRow = '<tr>';
    weekdays.forEach(day => headerRow += `<th>${day}</th>`);
    headerRow += '</tr>';
    calendar.innerHTML += headerRow;

    
    let dateRow = '<tr>';
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startDay; i++) {
        dateRow += '<td></td>';
    }

    for (let date = 1; date <= lastDay.getDate(); date++) {
        if ((startDay + date - 1) % 7 === 0) {
            dateRow += '</tr><tr>';
        }
        dateRow += `<td>${date}</td>`;
    }

    dateRow += '</tr>';
    calendar.innerHTML += dateRow;
}


document.getElementById('month').addEventListener('input', function() {
    let month = parseInt(this.value);
    if (month < 1) this.value = 1;
    else if (month > 12) this.value = 12;
});


document.getElementById('year').addEventListener('blur', function() {
    let year = parseInt(this.value);
    if (year < 1920) this.value = 1920;
    else if (year > 2050) this.value = 2050;
});


document.getElementById('year').addEventListener('input', function() {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
});


// Task 6


const links = document.querySelectorAll('#link-list a');


links.forEach(link => {
    if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
        link.classList.add('external-link');
    }
});

// Task 7

const bookList = document.getElementById('book-list');
let lastSelectedIndex = null;

bookList.addEventListener('click', function (e) {
    const items = Array.from(bookList.children);
    
    if (e.target.tagName === 'LI') {
        if (e.ctrlKey) {
            e.target.classList.toggle('selected');
        } else if (e.shiftKey && lastSelectedIndex !== null) {
            const currentIndex = items.indexOf(e.target);
            const [start, end] = [lastSelectedIndex, currentIndex].sort((a, b) => a - b);
            for (let i = start; i <= end; i++) {
                items[i].classList.add('selected');
            }
        } else {
            items.forEach(item => item.classList.remove('selected'));
            e.target.classList.add('selected');
            lastSelectedIndex = items.indexOf(e.target);
        }
    }
});

// Task 8 

const textDisplay = document.getElementById('textDisplay');
const textEdit = document.getElementById('textEdit');


document.addEventListener('keydown', function(e) {
    
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();  
        textEdit.value = textDisplay.innerText;  
        textDisplay.style.display = 'none';  
        textEdit.style.display = 'block';  
        textEdit.focus();  
    }

    
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();  
        textDisplay.innerText = textEdit.value;  
        textEdit.style.display = 'none';  
        textDisplay.style.display = 'block';  
    }
});


// Task 9 

document.querySelectorAll('.sortable-table th').forEach(header => {
    header.addEventListener('click', () => {
        const table = header.closest('table');
        const index = Array.from(header.parentNode.children).indexOf(header);
        const type = header.getAttribute('data-type');
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        const sortedRows = rows.sort((rowA, rowB) => {
            const cellA = rowA.children[index].innerText;
            const cellB = rowB.children[index].innerText;

            if (type === 'number') {
                return parseFloat(cellA) - parseFloat(cellB);
            }

            return cellA.localeCompare(cellB);
        });

        table.querySelector('tbody').append(...sortedRows);
    });
});
