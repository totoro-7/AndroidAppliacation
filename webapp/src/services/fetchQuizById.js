import { ref, get, getDatabase } from 'firebase/database';
import { realtimeDb } from '../firebase'; // Import your Firebase Realtime Database instance

// Function to fetch a quiz by its ID from Firebase Realtime Database
const fetchQuizById = async (quizId) => {
  // No need to initialize database here if you've already done it in your firebase.js file
  const quizRef = ref(realtimeDb, `quizzes/${quizId}`);

  try {
    const snapshot = await get(quizRef);
    if (snapshot.exists()) {
      return { ...snapshot.val(), id: quizId }; // Ensure you return the ID too, if needed
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw error;
  }
};

export default fetchQuizById;
