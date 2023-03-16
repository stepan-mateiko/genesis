// Fetch course data from API
// ALL VIDEO LINKS DON"T WORK - I changed them to another random videos
fetch("db.json")
  .then((response) => response.json())
  .then((course) => {
    const courseId = course.id;
    const courseInfo = document.querySelector(".course-info");
    const lessonList = document.querySelector(".lesson-list");
    const video = document.querySelector("video");
    let videoTitle = document.querySelector(".video__title");
    const videoContainer = document.querySelector(".video-container");
    const videoOverlay = document.querySelector(".video-overlay");
    const videoSpeed = document.createElement("div");
    let currentLessonId = course.lessons.id;

    // Display course info
    courseInfo.innerHTML = `
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <ul>
        <li>${course.numLessons} Lessons</li>
        <li>${course.numSkills} Skills</li>
        <li>${course.rating} Rating</li>
      </ul>
    `;

    // Display lesson list
    course.lessons.forEach((lesson) => {
      const lessonItem = document.createElement("div");
      lessonItem.classList.add("lesson-item");
      lessonItem.innerText = lesson.title;
      if (lesson.id !== currentLessonId && lesson.status === "locked") {
        lessonItem.classList.add("locked");
      }
      if (lesson.status !== "locked") {
        lessonItem.addEventListener("click", () => {
          videoTitle.innerText = lesson.title;
          video.src = lesson.link;
          video.poster = lesson.previewImageLink + "/" + lesson.order + ".webp";
          currentLessonId = lesson.id;
          localStorage.setItem(
            `progress-${courseId}`,
            JSON.stringify({ lessonId: currentLessonId, time: 0 })
          );
          video.play();
          videoOverlay.style.display = "none";
        });
      }
      lessonList.appendChild(lessonItem);
    });

    // Display current lesson progress
    const progressData = JSON.parse(
      localStorage.getItem(`progress-${courseId}`)
    );
    if (progressData) {
      currentLessonId = progressData.lessonId;
      video.currentTime = progressData.time;
    }

    // Enable picture-in-picture
    video.addEventListener("click", () => {
      if (videoContainer.classList.contains("pip")) {
        document.exitPictureInPicture();
        videoContainer.classList.remove("pip");
      } else {
        videoContainer.requestPictureInPicture();
        videoContainer.classList.add("pip");
      }
    });

    // Show video speed info on mouseover
    videoContainer.addEventListener("mouseover", () => {
      videoSpeed.style.display = "block";
    });
    videoContainer.addEventListener("mouseout", () => {
      videoSpeed.style.display = "none";
    });
    videoSpeed.innerText = "Press [S] to change playback speed";
    videoContainer.appendChild(videoSpeed);

    // Change video playback speed on keydown
    document.addEventListener("keydown", (event) => {
      if (event.key === "s") {
        event.preventDefault();
        const speeds = [0.5, 1, 1.5, 2];
        const currentSpeedIndex = speeds.indexOf(video.playbackRate);
        const nextSpeedIndex =
          currentSpeedIndex === speeds.length - 1 ? 0 : currentSpeedIndex + 1;
        video.playbackRate = speeds[nextSpeedIndex];
        videoSpeed.innerText = `Playback speed: ${speeds[nextSpeedIndex]}x`;
      }
    });
  })
  .catch((error) => console.error(error));
