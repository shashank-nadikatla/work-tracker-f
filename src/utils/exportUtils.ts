import jsPDF from 'jspdf';
import { ActivityEntry } from '@/store/useActivityStore';
import { format, parseISO } from 'date-fns';

export const exportToPDF = (summary: string, entries?: ActivityEntry[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  let yPosition = margin;
  
  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Work Tracker - Work Summary', margin, yPosition);
  yPosition += 20;
  
  // Date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, margin, yPosition);
  yPosition += 20;
  
  // Summary content
  pdf.setFontSize(11);
  const summaryLines = pdf.splitTextToSize(summary, maxWidth);
  
  summaryLines.forEach((line: string) => {
    if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    // Handle markdown-style headers
    if (line.startsWith('## ')) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(line.substring(3), margin, yPosition);
      yPosition += 8;
    } else if (line.startsWith('### ')) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(line.substring(4), margin, yPosition);
      yPosition += 6;
    } else if (line.startsWith('**') && line.endsWith('**')) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(line.substring(2, line.length - 2), margin, yPosition);
      yPosition += 5;
    } else if (line.startsWith('- ')) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`• ${line.substring(2)}`, margin + 10, yPosition);
      yPosition += 5;
    } else if (line.trim()) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    } else {
      yPosition += 3;
    }
  });
  
  // Add detailed entries if provided
  if (entries && entries.length > 0) {
    yPosition += 20;
    if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Detailed Activity Log', margin, yPosition);
    yPosition += 15;
    
    entries.forEach((entry) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - margin - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Date
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(format(parseISO(entry.date), 'EEEE, MMMM dd, yyyy'), margin, yPosition);
      yPosition += 6;
      
      // Content
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const contentLines = pdf.splitTextToSize(entry.content, maxWidth - 10);
      contentLines.forEach((line: string) => {
        pdf.text(line, margin + 5, yPosition);
        yPosition += 4;
      });
      
      // Tags
      if (entry.tags.length > 0) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(9);
        pdf.text(`Tags: ${entry.tags.join(', ')}`, margin + 5, yPosition);
        yPosition += 4;
      }
      
      yPosition += 8; // Space between entries
    });
  }
  
  // Save the PDF
  const filename = `work-tracker-summary-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(filename);
};

export const exportToMarkdown = (summary: string, entries?: ActivityEntry[]) => {
  let markdown = summary;
  
  if (entries && entries.length > 0) {
    markdown += '\n\n---\n\n## Detailed Activity Log\n\n';
    
    entries.forEach((entry) => {
      markdown += `### ${format(parseISO(entry.date), 'EEEE, MMMM dd, yyyy')}\n\n`;
      markdown += `${entry.content}\n\n`;
      
      if (entry.tags.length > 0) {
        markdown += `**Tags:** ${entry.tags.join(', ')}\n\n`;
      }
      
      markdown += '---\n\n';
    });
  }
  
  // Create and download markdown file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `work-tracker-summary-${format(new Date(), 'yyyy-MM-dd')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (entries: ActivityEntry[]) => {
  const data = {
    exportDate: new Date().toISOString(),
    totalEntries: entries.length,
    entries: entries.map(entry => ({
      ...entry,
      exportedAt: new Date().toISOString()
    }))
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `work-tracker-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};