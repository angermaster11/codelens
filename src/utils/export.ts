import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { AnalyzeResponse } from '../types';

export const copyToClipboard = async (data: AnalyzeResponse): Promise<void> => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copied to clipboard!');
  } catch {
    toast.error('Failed to copy to clipboard');
  }
};

export const downloadJSON = (data: AnalyzeResponse, filename: string): void => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('JSON downloaded!');
  } catch {
    toast.error('Failed to download JSON');
  }
};

export const exportPDF = (data: AnalyzeResponse): void => {
  try {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CodeLens AI - Profile Analysis', margin, y);
    y += 12;

    // Username
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Username: ${data.username}`, margin, y);
    y += 10;

    // AI Analysis
    if (data.ai_analysis) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Analysis', margin, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const scores = [
        `Overall Score: ${data.ai_analysis.overall_score}/100`,
        `DSA Strength: ${data.ai_analysis.dsa_strength}/100`,
        `Competitive Programming: ${data.ai_analysis.competitive_programming_level}/100`,
        `Open Source: ${data.ai_analysis.open_source_level}/100`,
        `Interview Readiness: ${data.ai_analysis.interview_readiness}/100`,
        `FAANG Readiness: ${data.ai_analysis.faang_readiness}/100`,
      ];

      scores.forEach((score) => {
        doc.text(score, margin, y);
        y += 6;
      });

      y += 4;

      // Strengths
      if (data.ai_analysis.strengths.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Strengths:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        data.ai_analysis.strengths.forEach((s) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(`• ${s}`, margin + 4, y);
          y += 6;
        });
        y += 4;
      }

      // Weaknesses
      if (data.ai_analysis.weaknesses.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Weaknesses:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        data.ai_analysis.weaknesses.forEach((w) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(`• ${w}`, margin + 4, y);
          y += 6;
        });
        y += 4;
      }

      // Recommended Topics
      if (data.ai_analysis.recommended_topics.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Recommended Topics:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        data.ai_analysis.recommended_topics.forEach((t) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(`• ${t}`, margin + 4, y);
          y += 6;
        });
        y += 4;
      }

      // Next Steps
      if (data.ai_analysis.next_steps.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Next Steps:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        data.ai_analysis.next_steps.forEach((step) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(`• ${step}`, margin + 4, y);
          y += 6;
        });
        y += 4;
      }

      // Personalized Feedback
      if (data.ai_analysis.personalized_feedback) {
        if (y > 240) {
          doc.addPage();
          y = margin;
        }
        doc.setFont('helvetica', 'bold');
        doc.text('Personalized Feedback:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(
          data.ai_analysis.personalized_feedback,
          170
        );
        lines.forEach((line: string) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 5;
        });
      }
    }

    doc.save(`codelens-ai-${data.username}-report.pdf`);
    toast.success('PDF exported!');
  } catch {
    toast.error('Failed to export PDF');
  }
};
