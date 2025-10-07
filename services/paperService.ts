import { Project } from "../types";

declare const jspdf: any;
declare const html2canvas: any;

const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    // Headings
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 14pt; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 16pt; font-weight: bold; margin-top: 1.2em; margin-bottom: 0.6em;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 18pt; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.8em;">$1</h1>')
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Paragraphs - wrap remaining lines that are not headings
    .split('\n').map(line => {
      if (line.trim().startsWith('<h')) {
        return line;
      }
      return line.trim() ? `<p style="margin-bottom: 0.8em;">${line}</p>` : '';
    }).join('');

  return html;
};

export const exportToPDF = async (project: Project) => {
  if (!project || !project.topic || !project.userProfile || project.outline.length === 0) {
    console.error("Project data is incomplete for PDF export.");
    alert("Cannot export to PDF. Ensure you have a generated outline.");
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  
  const tempContainer = document.createElement('div');
  document.body.appendChild(tempContainer);
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.background = 'white';
  tempContainer.style.color = 'black';
  tempContainer.style.fontFamily = "'Times New Roman', Times, serif";

  // --- 1. Render Title Page ---
  const titlePageContainer = document.createElement('div');
  titlePageContainer.style.width = `${PAGE_WIDTH}mm`;
  titlePageContainer.style.height = `${PAGE_HEIGHT}mm`;
  titlePageContainer.style.display = 'flex';
  titlePageContainer.style.flexDirection = 'column';
  titlePageContainer.style.justifyContent = 'center';
  titlePageContainer.style.alignItems = 'center';
  titlePageContainer.style.textAlign = 'center';
  titlePageContainer.style.padding = '25mm';
  titlePageContainer.style.boxSizing = 'border-box';
  
  titlePageContainer.innerHTML = `
    <div style="font-size: 24pt; font-weight: bold;">${project.topic.title}</div>
    <div style="font-size: 16pt; margin-top: 40mm;">by</div>
    <div style="font-size: 16pt; margin-top: 5mm; font-weight: bold;">${project.userProfile.name}</div>
    <div style="position: absolute; bottom: 50mm; left: 0; right: 0;">
      <p style="font-size: 12pt; margin: 0;">A thesis submitted for the degree of</p>
      <p style="font-size: 12pt; margin-top: 5mm;">${project.userProfile.academicLevel} ${project.userProfile.degreeName || ''}</p>
      <p style="font-size: 12pt; margin-top: 5mm;">${project.userProfile.stream}</p>
      <p style="font-size: 12pt; margin-top: 20mm;">${new Date().getFullYear()}</p>
    </div>
  `;
  tempContainer.appendChild(titlePageContainer);

  try {
    const titleCanvas = await html2canvas(titlePageContainer, { scale: 3 }); // Increased scale for better quality
    const titleImgData = titleCanvas.toDataURL('image/png');
    doc.addImage(titleImgData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  } catch(e) {
    console.error("Failed to render title page", e);
    alert("Error creating title page for PDF.");
  }
  tempContainer.removeChild(titlePageContainer);

  // --- 2. Render Content Pages ---
  const contentContainer = document.createElement('div');
  contentContainer.style.width = `${PAGE_WIDTH - 50}mm`; // Width minus margins (25mm left + 25mm right)
  contentContainer.style.fontSize = '12pt';
  contentContainer.style.padding = '0'; // Padding is handled by the PDF margin
  contentContainer.style.boxSizing = 'border-box';
  contentContainer.style.textAlign = 'justify';
  contentContainer.style.lineHeight = '2';

  const contentHTML = project.outline.map(section => {
    const sectionData = project.progressivePaperData[section.title];
    const content = sectionData ? sectionData.markdown : 'This section has not been written yet.';
    const sectionHtml = markdownToHtml(content);
    return `<div style="page-break-before: always;">
              <h1 style="font-size: 20pt; font-weight: bold; margin-bottom: 1em; text-align: left;">${section.title}</h1>
              ${sectionHtml}
            </div>`;
  }).join('');
  
  contentContainer.innerHTML = contentHTML;
  tempContainer.appendChild(contentContainer);
  
  try {
    doc.addPage();
    // Use jsPDF's html method which is better at handling pagination
    await doc.html(contentContainer, {
      x: 25, // Left margin
      y: 25, // Top margin
      width: PAGE_WIDTH - 50, // Content width
      windowWidth: contentContainer.scrollWidth,
      autoPaging: 'text',
      margin: [25, 25, 25, 25]
    });
  } catch (err) {
    console.error("Failed to render content pages", err);
    alert("Error creating content pages for PDF.");
  }

  doc.save(`${project.topic?.title.replace(/ /g, '_')}.pdf`);
  document.body.removeChild(tempContainer);
};