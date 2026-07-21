 
import React from 'react';
import jsPDF from 'jspdf';

interface CertificateProps {
  userName: string;
  skill: string;
  partnerName: string;
  duration: string;
  onClose: () => void;
}

function Certificate({ userName, skill, partnerName, duration, onClose }: CertificateProps) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  function downloadCertificate() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(15, 10, 40);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setDrawColor(236, 72, 153);
    doc.setLineWidth(0.5);
    doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

    // Title
    doc.setTextColor(168, 85, 247);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLTENSO', pageWidth / 2, 30, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text('Certificate of Completion', pageWidth / 2, 50, { align: 'center' });

    // Divider
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(0.5);
    doc.line(40, 58, pageWidth - 40, 58);

    // Body
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, 72, { align: 'center' });

    // Name
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(userName, pageWidth / 2, 90, { align: 'center' });

    // Description
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed a skill exchange session in', pageWidth / 2, 105, { align: 'center' });

    // Skill
    doc.setTextColor(168, 85, 247);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text(skill, pageWidth / 2, 120, { align: 'center' });

    // Details
    doc.setTextColor(180, 180, 200);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`with ${partnerName} for ${duration}`, pageWidth / 2, 133, { align: 'center' });

    // Divider
    doc.setDrawColor(168, 85, 247);
    doc.line(40, 142, pageWidth - 40, 142);

    // Date and signature
    doc.setTextColor(150, 150, 170);
    doc.setFontSize(11);
    doc.text(`Date: ${date}`, 50, 158);
    doc.text('SkillTenso Platform', pageWidth - 50, 158, { align: 'right' });

    // Stars decoration
    doc.setTextColor(245, 158, 11);
    doc.setFontSize(16);
    doc.text('★ ★ ★ ★ ★', pageWidth / 2, 168, { align: 'center' });

    doc.save(`SkillTenso_Certificate_${userName}_${skill}.pdf`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>

      <div className="w-full max-w-2xl rounded-2xl p-8"
        style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid rgba(168,85,247,0.4)' }}>

        {/* Preview */}
        <div className="rounded-xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f0a28, #1e1b4b)', border: '2px solid rgba(168,85,247,0.5)' }}>

          <div className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(circle at center, #7c3aed, transparent)' }} />

          <div className="relative z-10">
            <p className="text-purple-400 text-sm font-bold tracking-widest mb-2">SKILLTENSO</p>
            <h2 className="text-2xl font-bold text-white mb-4">Certificate of Completion</h2>

            <div className="w-full h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />

            <p className="text-gray-400 text-sm mb-2">This is to certify that</p>
            <h3 className="text-3xl font-bold mb-3" style={{ color: '#ec4899' }}>{userName}</h3>
            <p className="text-gray-400 text-sm mb-2">has successfully completed a skill exchange session in</p>
            <h4 className="text-2xl font-bold mb-2" style={{ color: '#a855f7' }}>{skill}</h4>
            <p className="text-gray-500 text-sm mb-4">with {partnerName} for {duration}</p>

            <div className="w-full h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }} />

            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-xs">{date}</p>
              <p className="text-yellow-400">★ ★ ★ ★ ★</p>
              <p className="text-gray-500 text-xs">SkillTenso Platform</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
            Close
          </button>
          <button onClick={downloadCertificate}
            className="flex-1 py-3 rounded-xl font-semibold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white' }}>
            📥 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Certificate;