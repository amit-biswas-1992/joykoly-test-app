import React from 'react';
import { View, Text } from 'react-native';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

export function MathRenderer({ content, className }: MathRendererProps) {
  if (!content) return null;

  // Function to process content and render math expressions
  const renderContent = (text: string) => {
    // Split by block math delimiters ($$...$$)
    const blockMathRegex = /\$\$(.*?)\$\$/g;
    const parts = text.split(blockMathRegex);
    
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Even indices are regular text (may contain inline math)
        if (parts[i]) {
          elements.push(
            <React.Fragment key={`text-${i}`}>
              {renderInlineMath(parts[i])}
            </React.Fragment>
          );
        }
      } else {
        // Odd indices are block math expressions
        if (parts[i]) {
          elements.push(
            <BlockMath key={`block-${i}`} math={parts[i]} />
          );
        }
      }
    }
    
    return elements.length > 0 ? elements : <Text>{text}</Text>;
  };
  
  // Function to process inline math ($...$)
  const renderInlineMath = (text: string) => {
    const inlineMathRegex = /\$(.*?)\$/g;
    const parts = text.split(inlineMathRegex);
    
    if (parts.length === 1) {
      // No math expressions found, return as is
      return <Text>{text}</Text>;
    }
    
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Even indices are regular text
        if (parts[i]) {
          elements.push(
            <Text key={`inline-text-${i}`}>{parts[i]}</Text>
          );
        }
      } else {
        // Odd indices are inline math expressions
        if (parts[i]) {
          elements.push(
            <InlineMath key={`inline-math-${i}`} math={parts[i]} />
          );
        }
      }
    }
    
    return <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{elements}</View>;
  };
  
  return (
    <View className={className}>
      {renderContent(content)}
    </View>
  );
}
