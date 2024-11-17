import fs from 'fs';
import pdf from 'pdf-parse';

async function extractSkillsFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    
    const data = await pdf(dataBuffer);
    const text = data.text;

    const skillsList = [
        
        'Python', 'C', 'C++', 'R', 'LATEX', 'JavaScript', 'SQL', 'NoSQL', 'Bash',

        
        'Scikit-learn', 'TensorFlow', 'PyTorch', 'ONNX', 'PyTorch Geometric', 'Deep Learning',
        'Natural Language Processing', 'NLP', 'Computer Vision', 'Audio Analysis', 'Signal Processing',
        'Graph Neural Networks', 'Time Series Forecasting', 'Generative AI', 'Spark', 'Hadoop', 'PySpark', 
        'Kafka', 'Stable Diffusion',

        
        'Git', 'VS Code', 'Nano', 'AWS Cloud Formation',

        
        'ReactJS', 'NodeJS', 'ExpressJS', 'Django', 'TailwindCSS', 'Bootstrap', 'Mongo', 'Flask', 'NEXT.js'
    ];

    // Extract skills that are present in the PDF text
    const extractedSkills = skillsList.filter(skill => text.includes(skill));

    return extractedSkills;
}

export { extractSkillsFromPDF };
