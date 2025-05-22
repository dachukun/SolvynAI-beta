
const templates: Record<string, string> = {
  "blank": "",
  "essay": `
    <h1 style="text-align: center; margin-bottom: 20px;">Essay Title</h1>
    <p style="text-align: center; margin-bottom: 20px;">Your Name</p>
    <p style="text-align: center; margin-bottom: 40px;">Course Name - Instructor's Name - Date</p>
    <p>Introduction paragraph: State your thesis and the purpose of your research paper clearly. Explain briefly the major points you plan to cover in your paper and why readers should be interested in your topic.</p>
    <br>
    <p>Body paragraph 1: Topic sentence that supports your thesis. Provide evidence, examples, and arguments to support this point.</p>
    <br>
    <p>Body paragraph 2: Topic sentence that supports your thesis. Provide evidence, examples, and arguments to support this point.</p>
    <br>
    <p>Body paragraph 3: Topic sentence that supports your thesis. Provide evidence, examples, and arguments to support this point.</p>
    <br>
    <p>Conclusion paragraph: Summarize the main points of your research paper. Restate your thesis and the purpose of your research paper. Explain the significance of your findings.</p>
    <br>
    <h2>Works Cited</h2>
    <p>Author's Last Name, First Name. "Title of Article." <em>Title of Source</em>, Publication Date, URL or page numbers.</p>
  `,
  "lab-report": `
    <h1 style="text-align: center; margin-bottom: 20px;">Lab Report Title</h1>
    <p style="text-align: center; margin-bottom: 40px;">Your Name - Partner Name(s) - Date</p>
    
    <h2>Abstract</h2>
    <p>A brief summary of your lab report, including the purpose, key findings, and conclusion. This should be a concise overview of what is contained in the report.</p>
    
    <h2>Introduction</h2>
    <p>Explain the purpose of the experiment and any relevant background information. State your hypothesis and the scientific principles that you're investigating.</p>
    
    <h2>Materials and Methods</h2>
    <p>List all the materials used in the experiment.</p>
    <p>Describe the procedure you followed in enough detail that someone else could replicate your experiment.</p>
    
    <h2>Results</h2>
    <p>Present the data collected from your experiment. Include tables, graphs, and charts as necessary.</p>
    
    <h2>Discussion</h2>
    <p>Analyze your results and explain what they mean. Compare your findings with your hypothesis. Discuss any sources of error and how they might have affected your results.</p>
    
    <h2>Conclusion</h2>
    <p>Summarize what you learned from the experiment. Discuss the implications of your findings and suggestions for further research.</p>
    
    <h2>References</h2>
    <p>List any sources you cited in your lab report, following the appropriate citation format.</p>
  `,
  "research": `
    <h1 style="text-align: center; margin-bottom: 20px;">Research Paper Title</h1>
    <p style="text-align: center; margin-bottom: 20px;">Your Name</p>
    <p style="text-align: center; margin-bottom: 40px;">Institution Affiliation</p>
    
    <h2>Abstract</h2>
    <p style="margin-bottom: 20px;">A brief summary of your research paper, including the purpose, methodology, findings, and conclusion. This should be no more than 250 words.</p>
    
    <h2>Introduction</h2>
    <p style="margin-bottom: 20px;">Introduce your research topic and provide some background information. State your research question or problem and explain why it's important. Outline the structure of your paper.</p>
    
    <h2>Literature Review</h2>
    <p style="margin-bottom: 20px;">Summarize the existing research on your topic. Identify gaps in the literature that your research will address.</p>
    
    <h2>Methodology</h2>
    <p style="margin-bottom: 20px;">Describe how you conducted your research. Include information about your participants, materials, procedures, and data analysis methods.</p>
    
    <h2>Results</h2>
    <p style="margin-bottom: 20px;">Present your findings. Include tables, graphs, and statistics as necessary.</p>
    
    <h2>Discussion</h2>
    <p style="margin-bottom: 20px;">Interpret your results and explain what they mean. Compare your findings with previous research. Discuss the implications of your findings and any limitations of your study.</p>
    
    <h2>Conclusion</h2>
    <p style="margin-bottom: 20px;">Summarize your main points and restate your thesis. Discuss the significance of your findings and suggest directions for future research.</p>
    
    <h2>References</h2>
    <p>List all the sources you cited in your paper, following APA format:</p>
    <p>Author, A. A. (Year). Title of work. Location: Publisher.</p>
    <p>Author, B. B., & Author, C. C. (Year). Title of article. Title of Periodical, volume(issue), pages.</p>
  `,
};

export const getDocumentTemplate = (templateId: string): string => {
  return templates[templateId] || '';
};
