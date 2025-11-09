import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import ProgressBar from "@/components/ProgressBar";
import { lessons, type Lesson } from "@/data/lessons";
import { useAppContext } from "@/context/AppContext";

type QuizState = {
  questionIndex: number;
  score: number;
  selectedOption: number | null;
  showExplanation: boolean;
  completed: boolean;
  pointsAwarded: number;
};

const initialQuizState: QuizState = {
  questionIndex: 0,
  score: 0,
  selectedOption: null,
  showExplanation: false,
  completed: false,
  pointsAwarded: 0
};

const LearnScreen = () => {
  const { state, completeLesson } = useAppContext();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setQuizState(initialQuizState);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedLesson(null);
    setQuizState(initialQuizState);
  };

  const handleOptionPress = (optionIndex: number) => {
    if (!selectedLesson) return;
    if (quizState.selectedOption !== null || quizState.completed) return;

    const question = selectedLesson.quiz[quizState.questionIndex];
    const isCorrect = optionIndex === question.answerIndex;

    setQuizState((prev) => ({
      ...prev,
      selectedOption: optionIndex,
      showExplanation: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNext = () => {
    if (!selectedLesson) return;
    const nextQuestionIndex = quizState.questionIndex + 1;
    if (nextQuestionIndex >= selectedLesson.quiz.length) {
      const alreadyCompleted = state.completedLessons.includes(selectedLesson.id);
      const pointsAwarded = alreadyCompleted ? 0 : completeLesson(selectedLesson.id);

      setQuizState((prev) => ({
        ...prev,
        completed: true,
        pointsAwarded
      }));
      return;
    }

    setQuizState((prev) => ({
      ...prev,
      questionIndex: nextQuestionIndex,
      selectedOption: null,
      showExplanation: false
    }));
  };

  const progress = selectedLesson
    ? (quizState.questionIndex + (quizState.completed ? 1 : 0)) / selectedLesson.quiz.length
    : 0;

  return (
    <View style={styles.screen}>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const completed = state.completedLessons.includes(item.id);
          return (
            <Pressable style={styles.lessonCard} onPress={() => handleSelectLesson(item)}>
              <View style={styles.lessonHeader}>
                <Text style={styles.lessonCategory}>{item.category}</Text>
                <View
                  style={[styles.statusBadge, completed ? styles.completedBadge : styles.newBadge]}
                >
                  <Text style={[styles.statusText, completed ? styles.completedText : styles.newText]}>
                    {completed ? "Completed" : `+${item.points} pts`}
                  </Text>
                </View>
              </View>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonMeta}>{item.duration}</Text>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.lessonList}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.hero}>
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroTitle}>Learn. Level Up. Unlock Toyota Offers.</Text>
                <Text style={styles.heroSubtitle}>
                  Master financial literacy bite-by-bite, ace quick quizzes, and exchange points for
                  exclusive Toyota Financial Services incentives built for students.
                </Text>
              </View>
              <View style={styles.pointsCard}>
                <Text style={styles.pointsLabel}>Your Score</Text>
                <Text style={styles.pointsValue}>{state.points} pts</Text>
                <Text style={styles.levelTag}>Level {state.level}</Text>
                <ProgressBar progress={(state.points % 250) / 250} />
                <Text style={styles.pointsFooter}>
                  {250 - (state.points % 250)} pts to reach Level {state.level + 1}
                </Text>
              </View>
            </View>
            <Text style={styles.sectionLabel}>Academy Tracks</Text>
          </View>
        }
      />

      <Modal visible={isModalVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {selectedLesson ? (
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalCategory}>{selectedLesson.category}</Text>
              <Text style={styles.modalTitle}>{selectedLesson.title}</Text>
              <Text style={styles.modalDescription}>{selectedLesson.description}</Text>

              <View style={styles.objectiveList}>
                {selectedLesson.objectives.map((objective) => (
                  <View key={objective} style={styles.objectiveItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.objectiveText}>{objective}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.startQuizButton}
                onPress={() =>
                  setQuizState((prev) => ({
                    ...prev,
                    showExplanation: false
                  }))
                }
              >
                <Text style={styles.startQuizLabel}>Jump into quiz</Text>
              </TouchableOpacity>

              <View style={styles.quizContainer}>
                <View style={styles.quizHeader}>
                  <Text style={styles.quizProgressLabel}>
                    Question {Math.min(quizState.questionIndex + 1, selectedLesson.quiz.length)} of{" "}
                    {selectedLesson.quiz.length}
                  </Text>
                  <ProgressBar progress={progress} />
                </View>

                {!quizState.completed ? (
                  <View>
                    <Text style={styles.quizQuestion}>
                      {selectedLesson.quiz[quizState.questionIndex].question}
                    </Text>
                    {selectedLesson.quiz[quizState.questionIndex].options.map((option, index) => {
                      const isSelected = quizState.selectedOption === index;
                      const isCorrect =
                        selectedLesson.quiz[quizState.questionIndex].answerIndex === index;

                      let buttonStyle = styles.quizOption;
                      let textStyle = styles.quizOptionText;

                      if (quizState.selectedOption !== null) {
                        if (isCorrect) {
                          buttonStyle = [styles.quizOption, styles.correctOption];
                          textStyle = [styles.quizOptionText, styles.correctOptionText];
                        } else if (isSelected) {
                          buttonStyle = [styles.quizOption, styles.incorrectOption];
                          textStyle = [styles.quizOptionText, styles.incorrectOptionText];
                        }
                      } else if (isSelected) {
                        buttonStyle = [styles.quizOption, styles.selectedOption];
                        textStyle = [styles.quizOptionText, styles.selectedOptionText];
                      }

                      return (
                        <TouchableOpacity
                          key={option}
                          style={buttonStyle}
                          activeOpacity={0.8}
                          onPress={() => handleOptionPress(index)}
                        >
                          <Text style={textStyle}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}

                    {quizState.showExplanation ? (
                      <View style={styles.explanationCard}>
                        <Text style={styles.explanationTitle}>Coach says</Text>
                        <Text style={styles.explanationText}>
                          {selectedLesson.quiz[quizState.questionIndex].explanation}
                        </Text>
                        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                          <Text style={styles.nextButtonText}>
                            {quizState.questionIndex === selectedLesson.quiz.length - 1
                              ? "See results"
                              : "Next question"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <View style={styles.resultsCard}>
                    <Text style={styles.resultsTitle}>Quiz complete!</Text>
                    <Text style={styles.resultsScore}>
                      You got {quizState.score} / {selectedLesson.quiz.length} correct.
                    </Text>
                    <Text style={styles.resultsPoints}>
                      {quizState.pointsAwarded > 0
                        ? `+${quizState.pointsAwarded} points added to your rewards balance.`
                        : "You’ve already banked points from this lesson—review any time."}
                    </Text>
                    <TouchableOpacity style={styles.resultsCloseButton} onPress={handleCloseModal}>
                      <Text style={styles.resultsCloseText}>Back to Academy</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  listHeader: {
    paddingTop: 48
  },
  hero: {
    paddingBottom: 24
  },
  heroTextGroup: {
    marginBottom: 16
  },
  heroTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
    color: "#101d35",
    marginBottom: 8
  },
  heroSubtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: "#4c6072",
    lineHeight: 22
  },
  pointsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 }
  },
  pointsLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    textTransform: "uppercase",
    color: "#ef2b2d"
  },
  pointsValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 32,
    marginVertical: 6,
    color: "#101d35"
  },
  levelTag: {
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    color: "#3648b0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    marginBottom: 8
  },
  pointsFooter: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#6c7c8f",
    marginTop: 10
  },
  sectionLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#374b63",
    marginBottom: 12
  },
  lessonList: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  lessonCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  lessonCategory: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    textTransform: "uppercase",
    color: "#586a85"
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  newBadge: {
    backgroundColor: "#ffe9ec"
  },
  completedBadge: {
    backgroundColor: "#e3f9e5"
  },
  statusText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12
  },
  newText: {
    color: "#ef2b2d"
  },
  completedText: {
    color: "#22a547"
  },
  lessonTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#18243a",
    marginTop: 12
  },
  lessonMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#5f7087",
    marginTop: 8
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 54,
    marginRight: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },
  closeButtonText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#1f2a44"
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  modalCategory: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#ef2b2d",
    textTransform: "uppercase",
    marginBottom: 8
  },
  modalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
    color: "#111f34",
    marginBottom: 12
  },
  modalDescription: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: "#46576c",
    lineHeight: 22,
    marginBottom: 16
  },
  objectiveList: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18
  },
  objectiveItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ef2b2d",
    marginTop: 8,
    marginRight: 12
  },
  objectiveText: {
    flex: 1,
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#46576c",
    lineHeight: 20
  },
  startQuizButton: {
    backgroundColor: "#111f34",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 20
  },
  startQuizLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#fff"
  },
  quizContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 80,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  quizHeader: {
    marginBottom: 16
  },
  quizProgressLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#2f3c4f",
    marginBottom: 8
  },
  quizQuestion: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#111f34",
    marginBottom: 16
  },
  quizOption: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d0d8e8",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff"
  },
  quizOptionText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#142640"
  },
  selectedOption: {
    backgroundColor: "#eef2ff",
    borderColor: "#3648b0"
  },
  selectedOptionText: {
    color: "#1d2f73"
  },
  correctOption: {
    backgroundColor: "#e3f9e5",
    borderColor: "#22a547"
  },
  correctOptionText: {
    color: "#128c36"
  },
  incorrectOption: {
    backgroundColor: "#ffe9ec",
    borderColor: "#ef2b2d"
  },
  incorrectOptionText: {
    color: "#c02029"
  },
  explanationCard: {
    marginTop: 10,
    backgroundColor: "#f6f7fb",
    borderRadius: 14,
    padding: 14
  },
  explanationTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#2f3c4f",
    marginBottom: 6
  },
  explanationText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4c6072",
    lineHeight: 20,
    marginBottom: 12
  },
  nextButton: {
    backgroundColor: "#ef2b2d",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center"
  },
  nextButtonText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#fff"
  },
  resultsCard: {
    alignItems: "center",
    paddingVertical: 20
  },
  resultsTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: "#101d35",
    marginBottom: 6
  },
  resultsScore: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 16,
    color: "#1d2f73",
    marginBottom: 10
  },
  resultsPoints: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4c6072",
    marginBottom: 18,
    textAlign: "center",
    paddingHorizontal: 12
  },
  resultsCloseButton: {
    backgroundColor: "#111f34",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999
  },
  resultsCloseText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#fff"
  }
});

export default LearnScreen;

