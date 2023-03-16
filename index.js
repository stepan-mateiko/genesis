const courseContainer = document.querySelector(".course-list");
const paginationContainer = document.querySelector(".pagination");

const limit = 10;
let currentPage = 1;

const fetchData = async () => {
  try {
    const response = await fetch("db.json");
    const data = await response.json();
    const courses = data.courses;
    const totalPages = Math.ceil(courses.length / limit);
    renderCourses(courses);
    renderPagination(totalPages);
  } catch (error) {
    console.log(error);
  }
};

const renderCourses = (courses) => {
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const displayedCourses = courses.slice(startIndex, endIndex);

  let courseHTML = "";

  displayedCourses.forEach((course) => {
    courseHTML += `
    <a href="/course_page/page.html" class="course">
        
          <video class="course__video" poster="${course.previewImageLink}/cover.webp" src="${course.meta.courseVideoPreview.link}" muted></video>
        
        <div class="course__details">
          <h3 class="course__details__title">${course.title}</h3>
          <div class="course__details__info">
            <div class="lesson-info">
              <p>${course.lessonsCount} Lessons</p>
              <p>${course.meta.skills}</p>
            </div>
            <div class="rating-info">
              <span class="rating">${course.rating}</span>
              <span class="rating-icon">★</span>
            </div>
          </div>
        </div>
      </a>
      
    `;
  });

  courseContainer.innerHTML = courseHTML;

  // playing video when hover on it (link is not working)
  const courseVideos = document.querySelectorAll(".course__video");

  courseVideos.forEach((video) => {
    video.addEventListener("mouseenter", () => {
      console.log(video.poster);
      video.play();
    });
    video.addEventListener("mouseleave", () => {
      video.pause();
    });
  });
};

const renderPagination = (totalPages) => {
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <button class="pagination__item ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;

  const paginationItems = document.querySelectorAll(".pagination__item");

  paginationItems.forEach((item) => {
    item.addEventListener("click", () => {
      currentPage = parseInt(item.dataset.page);
      fetchData();
      window.scrollTo(0, 0);
    });
  });
};

fetchData();
