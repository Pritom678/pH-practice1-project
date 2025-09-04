
const createElement = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn">${el}</span>`)
    return(htmlElements.join('  '))
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if(status == true){
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    }
    else{
        document.getElementById('word-container').classList.remove('hidden')
        document.getElementById('spinner').classList.add('hidden')
    }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(json => displayLessons(json.data));
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    lessonButtons.forEach(btn => btn.classList.remove('active'));

}

const loadLevelWord = (id) =>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActive()//removes all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add('active')//add active class
        displayLevelWord(data.data)
    });
}

const loadWordDetail = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
    
};

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML= `
    <div>
            <h2 class="text-2xl font-bold">
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})
            </h2>
        </div>
        <div>
            <h2 class="text-2xl font-bold">Meaning</h2>
            <p>${word.meaning}</p>
        </div>
        <div>
            <h2 class="text-2xl font-bold">Example</h2>
            <p>${word.sentence}</p>
        </div>
        <div>
            <h2 class="text-2xl font-bold">Synonym</h2>
            <div>${createElement(word.synonyms)}</div>
        </div>
    `;
    document.getElementById('word_modal').showModal()

};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = '';

    if(words.length == 0){
        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 font-bangla">
        <img class="mx-auto" src ="./assets/alert-error.png"/>
            <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageSpinner(false)
        return;
    }

    words.forEach(word => {
        console.log(word);
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="text-2xl font-bold">${word.word ? word.word : "word not found"}</h2>
            <p class="font-semibold">Meaning / Pronunciation</p>

            <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning: "meaning not found"} / ${word.pronunciation ? word.pronunciation: "pronunciation not found"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff5a]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick = "pronounceWord('${word.word}')" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ff5a]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>

        `;
        wordContainer.append(card)
    });
    manageSpinner(false)
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = ''; 

    lessons.forEach(lesson => {
        console.log(lesson)
        const btnDiv = document.createElement('div')
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick='loadLevelWord(${lesson.level_no})' class = 'btn btn-outline btn-primary lesson-btn'>
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Lesson - ${lesson.level_no}
            </button>
        `;
        levelContainer.append(btnDiv)
    });
};


loadLessons();


//you could search anything

document.getElementById('btn-search').addEventListener('click', ()=> {
    removeActive();
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWord(filterWords)
    });
});