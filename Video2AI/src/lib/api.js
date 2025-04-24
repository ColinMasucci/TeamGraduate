async function handleFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Request failed (${res.status}): ${errorText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Fetch error at ${url}:`, err);
    throw err;
  }
}




export async function fetchSavedQuizzes(userId) {
  if (!userId) throw new Error('User not authenticated');
  return await handleFetch(`/api/getSavedQuiz?userId=${userId}`, {
    method: 'GET',
  });
}

export async function saveQuiz(quizData) {
  return await handleFetch('/api/saveQuiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizData),
  });
}

export async function deleteQuiz(id) {
  return await handleFetch('/api/deleteQuiz', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
}

export async function generateTranscript(videoUrl) {
  return await handleFetch('/api/transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoUrl }),
  });
}

export async function getMatchingPairs(videoUrl) {
  return await handleFetch('/api/getMatchingPairs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoUrl }),
  });
}



export async function generateFeedback(quiz, userAnswers) {
  return await handleFetch('/api/quizFeedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quiz, userAnswers }),
  });
}

export async function saveMatchingResult(userId, username, score) {
  return await handleFetch('/api/saveMatchingResult', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, username, score }),
  });
}

export async function fetchLeaderboard() {
  return await handleFetch('/api/leaderboard', {
    method: 'GET',
  });
}

export async function saveTimeSpent(userId, page, durationMs) {

  if (!userId) return;

  return await handleFetch('/api/saveTimeSpent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      page,
      durationSeconds: Math.floor(durationMs / 1000),
      timestamp: new Date().toISOString(),
    }),
  });
}

export async function saveTranscript(userId, videoUrl, transcript) {

  if (!userId) return;

  return await handleFetch('/api/saveTranscript', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      videoUrl,
      transcript
    }),
  });
}

export async function generateQuizQuestions(transcript) {
  return await handleFetch('/api/quizQuestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  });
}

export async function fetchTranscript(videoUrl) {
  if (!videoUrl) throw new Error('videoUrl is required');

  return await handleFetch(`/api/getTranscript?videoUrl=${encodeURIComponent(videoUrl)}`, {
    method: 'GET',
  });
}




// quiz
// : 
// (5) [{…}, {…}, {…}, {…}, {…}]
// userIdentifier
// : 
// "user_2jvPkU9SkQQfHpVUCUi0tAGSCim" -pic
//user_2jvPkU9SkQQfHpVUCUi0tAGSCim -pic
// user_2jvBYTEH3qlNRVmNSrS5UVXUxyW -simple
// videoUrl
// : 
// "https://youtu.be/-iWaarLI7zI?si=bau7hW1VlMW0-nvz"
// [[Prototype]]
// : 
// Object