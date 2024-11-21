import fs from 'fs';
import pdf from 'pdf-parse';

async function extractSkillsFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    
    const data = await pdf(dataBuffer);
    const text = data.text.toLowerCase();

    const skillsList = [
        
        'python', 'c', 'c++', 'r', 'latex', 'javascript', 'sql', 'nosql', 'bash',

        
        'scikit-learn', 'tensorflow', 'pytorch', 'onnx', 'pytorch geometric', 'deep learning',
        'natural language processing', 'nlp', 'computer vision', 'audio analysis', 'signal processing',
        'graph neural networks', 'time series forecasting', 'generative ai', 'spark', 'hadoop', 'pyspark', 
        'kafka', 'stable diffusion','docker', 'kubernetes',

        
        'git', 'vs code', 'nano', 'aws cloud formation',

        
        'reactjs', 'nodejs', 'expressjs', 'django', 'tailwindcss', 'bootstrap', 'mongo', 'flask', 'next.js'
    ];

    // Extract skills that are present in the PDF text (all lowercase comparison)
    const extractedSkills = skillsList.filter(skill => text.includes(skill.toLowerCase()));

    return extractedSkills;
}

export { extractSkillsFromPDF };
