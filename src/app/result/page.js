"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const candidateName = searchParams.get("name") || "Not Available";
  const candidateDob = searchParams.get("dob") || "Not Available";

  const [result, setResult] = useState({
    status: "PENDING",
    percentage: 0,
    subjects: [],
    totalMarks: 0,
  });
  const [examDetails, setExamDetails] = useState({
    rollNumber: "",
    admitCardId: "",
    dob: candidateDob,
  });

  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  // Generate random exam details
  const generateRandomDetails = () => {
    const rollNumber = `VMG${Math.floor(Math.random() * 10000000000)}`;
    const admitCardId = `AC${Math.floor(Math.random() * 1000000000)}`;
    return { rollNumber, admitCardId, dob: candidateDob };
  };

  // Generate random scores for a list of subjects
  const generateScores = (subjectList) => {
    subjectList.forEach((subject) => {
      subject.theory = Math.floor(Math.random() * 81); // 0-80
      subject.practical = Math.floor(Math.random() * 21); // 0-20
      subject.total = subject.theory + subject.practical;
      subject.grade = getGrade(subject.total);
    });
    return subjectList; // Return the updated list
  };

  const getGrade = (total) => {
    if (total >= 90) return "A1";
    if (total >= 80) return "A2";
    if (total >= 70) return "B1";
    if (total >= 60) return "B2";
    if (total >= 50) return "C1";
    return "C2";
  };

  useEffect(() => {
    const storageKeyPrefix = `hostelGuardResult_${candidateName}_${candidateDob}`;
    const storedDetails = localStorage.getItem(`${storageKeyPrefix}_details`);
    const storedScores = localStorage.getItem(`${storageKeyPrefix}_scores`);

    let details;
    if (storedDetails) {
      details = JSON.parse(storedDetails);
    } else {
      details = generateRandomDetails();
      localStorage.setItem(`${storageKeyPrefix}_details`, JSON.stringify(details));
    }

    let scoresData;
    if (storedScores) {
      scoresData = JSON.parse(storedScores);
    } else {
      // Generate subjects and scores if not in localStorage
      const coreSubjects = [
        { code: "101", name: "Hostel Security Basics" },
        { code: "102", name: "Visitor Entry Rules" },
        { code: "103", name: "Night Patrol Duties" },
      ];
      const additionalSubjects = [
        { code: 'A01', name: 'Room 69 Raid Tactics' },
        { code: 'A02', name: 'Moan Decibel Analysis' },
        { code: 'A03', name: 'Nudes Sniffing via WiFi' },
        { code: 'A04', name: 'Creaking Bed Detection' },
        { code: 'A05', name: 'Lie Detector: "Just Friends"' },
      ];

      const allSubjects = [
        ...generateScores(coreSubjects),
        ...generateScores(additionalSubjects),
      ];

      const totalMarks = allSubjects.reduce((acc, s) => acc + s.total, 0);
      // Calculate total percentage based on a total of 6 subjects (6 * 100 = 600)
      const totalPercentage = (totalMarks / 600) * 100;

      const cutoff = 73.2;
      const status = totalPercentage >= cutoff ? "SELECTED" : "NOT SELECTED";

      scoresData = {
        subjects: allSubjects,
        totalMarks,
        totalPercentage,
        status,
      };
      localStorage.setItem(`${storageKeyPrefix}_scores`, JSON.stringify(scoresData));
    }

    // Update state with loaded or generated data
    setExamDetails(details);
    setResult({
      status: scoresData.status,
      percentage: scoresData.totalPercentage.toFixed(2),
      subjects: scoresData.subjects,
      totalMarks: scoresData.totalMarks,
    });

  }, [candidateName, candidateDob]);

  const handlePrint = () => window.print();

  const handleRecheckClick = () => {
    setIsImagePopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsImagePopupOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e1e8] to-[#e0c5d1] py-0 px-2 print:p-0">
      {/* Header (Visible on screen, hidden in print) */}
      <div  className="bg-[#c4528b] text-white text-center py-5 rounded-t-lg max-w-4xl mx-auto relative shadow-lg print:hidden">
        <div className="text-2xl font-bold">LADIES HOSTEL SECURITY BOARD</div>
        <div className="text-lg">Girls Hostel Guard Entrance Examination 2025</div>
        <div className="text-sm mt-1">"Protecting Virtue, Preserving Privacy"</div>
         {/* Existing Print/Home buttons on screen - ADDING Recheck button here */}
        
      </div>

      {/* Main Card (Visible on screen and in print, with different styles) */}
      <div id="result-card" className="bg-white border-2 border-[#e0c5d1] max-w-4xl mx-auto rounded-b-lg shadow-xl p-8 print:shadow-none print:rounded-none print:border-[2.5mm] print:border-[#c4528b] print:max-w-full print:mx-0 print:p-6 print:box-border print:min-h-[287mm] print:relative">

        {/* Print Header (Hidden on screen, visible in print) */}
        <div className="hidden print:block text-center py-5 rounded-t-lg max-w-4xl mx-auto relative shadow-lg">
             <div className="text-xl font-bold">LADIES HOSTEL SECURITY BOARD</div>
             <div className="text-base">Girls Hostel Guard Entrance Examination 2025</div>
             <div className="text-xs mt-1">"Protecting Virtue, Preserving Privacy"</div>
        </div>

        {/* Candidate Details Table */}
        <div className="bg-[#f5e1e8] p-4 rounded-lg mb-6 print:p-3 print:mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:gap-4">
            <div className="break-words">
              <p className="font-semibold text-gray-800 print:text-sm">Roll No: <span className="font-normal">{examDetails.rollNumber}</span></p>
            </div>
            <div className="break-words">
              <p className="font-semibold text-gray-800 print:text-sm">Name: <span className="font-normal">{candidateName}</span></p>
            </div>
            <div className="break-words">
              <p className="font-semibold text-gray-800 print:text-sm">Admit Card ID: <span className="font-normal">{examDetails.admitCardId}</span></p>
            </div>
            <div className="break-words">
              <p className="font-semibold text-gray-800 print:text-sm">DOB: <span className="font-normal">{examDetails.dob}</span></p>
            </div>
          </div>
        </div>

        {/* Core Subjects */}
        <div className="mb-6 print:mb-4">
          <h2 className="text-xl font-bold text-[#c4528b] mb-3 print:text-lg print:mb-2">Core Security Training</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-[#e0c5d1] rounded-lg print:border print:border-[#c4528b]">
              <thead className="bg-[#f5e1e8] print:bg-[#e0c5d1]">
                <tr>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Subject Code</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Subject Name</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Theory (80)</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Practical (20)</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Total</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.slice(0, 3).map((subject, idx) => (
                  <tr key={idx} className="hover:bg-[#f5e1e8] print:hover:bg-transparent">
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">{subject.code}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm">{subject.name}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm">{subject.theory}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm">{subject.practical}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 font-bold print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm print:font-bold">{subject.total}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 font-bold print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm print:font-bold">{subject.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Subjects */}
        <div className="mb-6 print:mb-4">
          <h2 className="text-xl font-bold text-[#c4528b] mb-3 print:text-lg print:mb-2">Additional Subject</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-[#e0c5d1] rounded-lg print:border print:border-[#c4528b]">
              <thead className="bg-[#f5e1e8] print:bg-[#e0c5d1]">
                <tr>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Subject Code</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Subject Name</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Theory (80)</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Practical (20)</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Total</th>
                  <th className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.slice(3).map((subject, idx) => (
                  <tr key={idx} className="hover:bg-[#f5e1e8] print:hover:bg-transparent">
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">{subject.code}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 print:border print:border-[#c4528b] print:px-3 print:py-1 print:text-sm">{subject.name}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800">{subject.theory}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800">{subject.practical}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 font-bold print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm print:font-bold">{subject.total}</td>
                    <td className="border-2 border-[#e0c5d1] px-4 py-2 text-gray-800 font-bold print:border print:border-[#c4528b] print:px-3 py-1 print:text-sm print:font-bold">{subject.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Result Status and Summary */}
        <div className="relative flex flex-col gap-7 print:gap-4 print:mb-4">
          <div className={`text-center font-bold text-2xl py-4 rounded-lg ${
            result.status === "SELECTED"
              ? "bg-green-100 text-green-700 border-2 border-green-300 print:bg-green-100 print:text-green-700 print:border print:border-green-300"
              : "bg-red-100 text-red-700 border-2 border-red-300 print:bg-red-100 print:text-red-700 print:border print:border-red-300"
          } print:text-xl print:py-3`}>
            {result.status}
          </div>
          <div className="bg-[#f5e1e8] p-4 rounded-lg text-center print:bg-[#e0c5d1]">
            <p className="text-lg text-gray-800 print:text-base">
              Total Marks: <span className="font-bold">{result.totalMarks}</span> |
              Percentage: <span className="font-bold">{result.percentage}%</span>
            </p>
            <p className="text-base text-gray-600 mt-2 print:text-sm print:mt-1">
              Cutoff: <span className="font-bold">73.2%</span>
            </p>
          </div>
           
        <div className="relative flex justify-end items-end">
          <div className="flex items-center gap-3 no-print">
<button
            onClick={handleRecheckClick}
            className="bg-white text-[#c4528b] px-4 py-2 rounded-lg font-bold text-sm border-2 border-[#e0c5d1] hover:bg-[#f5e1e8] transition-all shadow-md"
          >
            Recheck
          </button>
          <a href="/" className="bg-white text-[#c4528b] px-4 py-2 rounded-lg font-bold text-sm border-2 border-[#e0c5d1] hover:bg-[#f5e1e8] transition-all shadow-md">Back to Home</a>
          <button onClick={handlePrint} className="bg-white text-[#c4528b] px-4 py-2 rounded-lg font-bold text-sm border-2 border-[#e0c5d1] hover:bg-[#f5e1e8] transition-all shadow-md">Print Result</button>
          </div>
        </div>
        </div>

        {/* Added Footer Content (Visible on screen, hidden in print) */}
        <div className="mt-8 pt-6 border-t border-[#e0c5d1] text-center text-gray-600 print:hidden">
          <p className="font-semibold text-[#c4528b]">Official Result Document</p>
          <p className="text-sm mt-2">
            This result is based on the performance in the Girls Hostel Guard Entrance Examination 2025.
            For verification or queries, please contact the Ladies Hostel Security Board.
          </p>
          <p className="text-xs mt-4">&copy; 2025 Ladies Hostel Security Board. All Rights Reserved.</p>
        </div>
         {/* Footer for Print (Hidden on screen, visible in print) */}
        <div className="hidden print:block text-center text-sm text-gray-600 mt-4">
          <p className="font-semibold">Ladies Hostel Security Board</p>
          <p className="text-xs mt-1">&copy; 2025 All Rights Reserved</p>
        </div>

        {/* Image Popup Modal - visible based on state, hidden in print */}
        {isImagePopupOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ease-out duration-300 no-print" // Added no-print
                onClick={handleClosePopup} // Close when clicking outside the image
                 style={{ opacity: isImagePopupOpen ? 1 : 0 }}
            >
                <div
                    className="bg-white p-4 rounded-lg max-w-full max-h-full overflow-auto relative" // Added relative for close button positioning
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
                >
                    {/* Updated image URL */}
                    <img
                        src="https://i.pinimg.com/736x/4b/c7/b2/4bc7b2e70bc970bc289f08fe8e20907a.jpg" // <-- Updated image path
                        alt="Recheck Information"
                        className="max-w-full max-h-full"
                    />
                     {/* Close button inside the modal */}
                    <button
                        onClick={handleClosePopup}
                        className="absolute top-2 right-2 bg-gray-300 rounded-full p-1 text-gray-800 hover:bg-gray-400 z-10" // Added z-10
                    >
                        &times; {/* Simple 'x' character for close */}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
