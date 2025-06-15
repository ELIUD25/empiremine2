import React, { useState } from 'react';
import { TrendingUp, BookOpen, Bell, BarChart3, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ExamQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Lesson {
  title: string;
  type: 'video' | 'text' | 'exam';
  content?: string;
  examQuestions?: ExamQuestion[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: Lesson[];
}

interface Signal {
  id: number;
  pair: string;
  type: 'BUY' | 'SELL';
  status: 'Active' | 'Hit TP1' | 'Closed';
  entry: string;
  tp1: string;
  tp2: string;
  sl: string;
  pips: string;
  time: string;
}

interface News {
  id: number;
  title: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  time: string;
}

interface Analysis {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const TradingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signals');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [examAnswers, setExamAnswers] = useState<{[key: number]: number}>({});
  const [showExamResults, setShowExamResults] = useState(false);
  const [examScore, setExamScore] = useState(0);

  const { 
    tradingSignals, 
    marketNews, 
    marketAnalysis, 
    tradingCourses 
  } = useData() as { 
    tradingSignals: Signal[]; 
    marketNews: News[]; 
    marketAnalysis: Analysis[]; 
    tradingCourses: Course[] 
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentLesson(0);
    setCompletedLessons([]);
    setExamAnswers({});
    setShowExamResults(false);
  };

  const handleCompleteLesson = () => {
    if (selectedCourse && !completedLessons.includes(currentLesson)) {
      setCompletedLessons(prev => [...prev, currentLesson]);
    }
  };

  const handleNextLesson = () => {
    if (selectedCourse && currentLesson < selectedCourse.lessons.length - 1) {
      if (completedLessons.includes(currentLesson)) {
        setCurrentLesson(prev => prev + 1);
      } else {
        alert('Please complete the current lesson before proceeding.');
      }
    }
  };

  const handleExamSubmit = () => {
    if (!selectedCourse) return;
    
    const currentLessonData: Lesson = selectedCourse.lessons[currentLesson];
    if (currentLessonData.type !== 'exam') return;

    let correct = 0;
    currentLessonData.examQuestions!.forEach((question: ExamQuestion, index: number) => {
      if (examAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / currentLessonData.examQuestions!.length) * 100);
    setExamScore(score);
    setShowExamResults(true);

    if (score >= 70) {
      handleCompleteLesson();
    }
  };

  const stats = [
    {
      label: 'Win Rate',
      value: '89%',
      color: 'text-green-400'
    },
    {
      label: 'Total Pips',
      value: '+2,850',
      color: 'text-blue-400'
    },
    {
      label: 'Signals Sent',
      value: tradingSignals.length.toString(),
      color: 'text-purple-400'
    },
    {
      label: 'Market Coverage',
      value: '24/7',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <TrendingUp className="h-10 w-10 text-green-400" />
            <span>Trading Signals & Education</span>
          </h1>
          <p className="text-xl text-gray-300">
            Professional forex signals and comprehensive trading education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 text-center">
              <p className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'signals', label: 'Live Signals', icon: TrendingUp },
              { id: 'education', label: 'Trading Courses', icon: BookOpen },
              { id: 'news', label: 'Market News', icon: Bell },
              { id: 'analysis', label: 'Market Analysis', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {activeTab === 'signals' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Live Trading Signals</h2>
              {tradingSignals.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Signals Available</h3>
                  <p className="text-gray-300">Check back later for new trading signals from our experts.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tradingSignals.map((signal) => (
                    <div key={signal.id} className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-xl font-semibold text-white">{signal.pair}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                              signal.type === 'BUY' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {signal.type === 'BUY' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                              <span>{signal.type}</span>
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              signal.status === 'Active' 
                                ? 'bg-blue-500/20 text-blue-400'
                                : signal.status === 'Hit TP1'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {signal.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Entry</p>
                              <p className="text-white font-medium">{signal.entry}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">TP1</p>
                              <p className="text-green-400 font-medium">{signal.tp1}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">TP2</p>
                              <p className="text-green-400 font-medium">{signal.tp2}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Stop Loss</p>
                              <p className="text-red-400 font-medium">{signal.sl}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Pips</p>
                              <p className="text-yellow-400 font-medium">{signal.pips}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                          <p className="text-gray-400 text-sm">{signal.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Trading Education</h2>
              {selectedCourse ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Back to Courses
                    </button>
                    <div className="text-white">
                      Lesson {currentLesson + 1} of {selectedCourse.lessons.length}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">{selectedCourse.title}</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{Math.round((completedLessons.length / selectedCourse.lessons.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedLessons.length / selectedCourse.lessons.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {selectedCourse.lessons[currentLesson] && (
                    <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-400/20 rounded-lg p-6 mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <h4 className="text-lg font-medium text-white">{selectedCourse.lessons[currentLesson].title}</h4>
                        {completedLessons.includes(currentLesson) && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      
                      {selectedCourse.lessons[currentLesson].type === 'video' ? (
                        <div className="mb-4">
                          <video
                            src={selectedCourse.lessons[currentLesson].content!}
                            controls
                            className="w-full rounded-lg"
                            onEnded={handleCompleteLesson}
                          />
                        </div>
                      ) : selectedCourse.lessons[currentLesson].type === 'text' ? (
                        <div className="prose prose-invert text-gray-300 mb-4">
                          <p>{selectedCourse.lessons[currentLesson].content}</p>
                        </div>
                      ) : selectedCourse.lessons[currentLesson].type === 'exam' ? (
                        <div className="mb-4">
                          <h5 className="text-lg font-medium text-white mb-4">Exam - Pass with 70% or higher</h5>
                          {selectedCourse.lessons[currentLesson].examQuestions!.map((question: ExamQuestion, qIndex: number) => (
                            <div key={qIndex} className="mb-6 p-4 bg-white/5 rounded-lg">
                              <p className="text-white mb-3">{question.question}</p>
                              <div className="space-y-2">
                                {question.options.map((option: string, oIndex: number) => (
                                  <label key={oIndex} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`question-${qIndex}`}
                                      value={oIndex}
                                      onChange={() => setExamAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                                      className="text-blue-600"
                                      disabled={showExamResults}
                                    />
                                    <span className="text-gray-300">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {!showExamResults ? (
                            <button
                              onClick={handleExamSubmit}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            >
                              Submit Exam
                            </button>
                          ) : (
                            <div className={`p-4 rounded-lg ${examScore >= 70 ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                              <p className={`font-medium ${examScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                                Score: {examScore}% - {examScore >= 70 ? 'Passed!' : 'Failed. Please retake the exam.'}
                              </p>
                              {examScore < 70 && (
                                <button
                                  onClick={() => {
                                    setShowExamResults(false);
                                    setExamAnswers({});
                                  }}
                                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                  Retake Exam
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <div className="flex justify-between">
                        {selectedCourse.lessons[currentLesson].type !== 'exam' && (
                          <button
                            onClick={handleCompleteLesson}
                            disabled={completedLessons.includes(currentLesson)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {completedLessons.includes(currentLesson) ? 'Completed' : 'Mark Complete'}
                          </button>
                        )}
                        
                        <button
                          onClick={handleNextLesson}
                          disabled={currentLesson >= selectedCourse.lessons.length - 1 || !completedLessons.includes(currentLesson)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                        >
                          Next Lesson
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {tradingCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Courses Available</h3>
                      <p className="text-gray-300">Check back later for new trading courses.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tradingCourses.map((course) => (
                        <div key={course.id} className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-400/20 rounded-lg p-6 hover:scale-105 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <BookOpen className="h-8 w-8 text-purple-400" />
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              course.level === 'Beginner' 
                                ? 'bg-green-500/20 text-green-400'
                                : course.level === 'Intermediate'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {course.level}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>{course.duration}</span>
                            <span>{course.lessons.length} lessons</span>
                          </div>
                          <button
                            onClick={() => handleStartCourse(course)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Start Course
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'news' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Market News & Updates</h2>
              {marketNews.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No News Available</h3>
                  <p className="text-gray-300">Check back later for market news and updates.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketNews.map((news) => (
                    <div key={news.id} className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{news.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              news.impact === 'High' 
                                ? 'bg-red-500/20 text-red-400'
                                : news.impact === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {news.impact} Impact
                            </span>
                          </div>
                          <p className="text-gray-300 mb-2">{news.summary}</p>
                          <p className="text-gray-400 text-sm">{formatTimeAgo(news.time)}</p>
                        </div>
                        <Bell className="h-5 w-5 text-blue-400 flex-shrink-0 ml-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Market Analysis</h2>
              {marketAnalysis.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Analysis Available</h3>
                  <p className="text-gray-300">Check back later for market analysis from our experts.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {marketAnalysis.map((analysis) => (
                    <div key={analysis.id} className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">{analysis.title}</h3>
                      <div className="prose prose-invert text-gray-300">
                        <p>{analysis.content}</p>
                      </div>
                      <p className="text-gray-400 text-sm mt-4">{formatTimeAgo(analysis.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingPage;