import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Katex from 'react-native-katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

const styles = StyleSheet.create({
  katex: {
    width: '100%',
  },
  katexInline: {
    minHeight: 20,
  },
  katexBlock: {
    marginVertical: 8,
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  }
});

const inlineStyle = `
html, body {
  display: flex;
  background-color: transparent;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}
.katex {
  font-size: 1em;
  margin: 0;
  display: flex;
}
`;

const blockStyle = `
html, body {
  display: flex;
  background-color: transparent;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0;
}
.katex {
  font-size: 1.2em;
  margin: 0;
  display: flex;
}
`;

export function MathRenderer({ content, className }: MathRendererProps) {
  if (!content) return null;

  // Normalize alternative delimiters \( ... \) and \[ ... \]
  const normalizeDelimiters = (text: string) => {
    let normalized = text;
    // \[ ... \] -> $$ ... $$
    normalized = normalized.replace(/\\\[(.*?)\\\]/gs, (_, m) => `$$${m}$$`);
    // \( ... \) -> $ ... $
    normalized = normalized.replace(/\\\((.*?)\\\)/gs, (_, m) => `$${m}$`);
    return normalized;
  };

  // Function to process content and render math expressions
  const renderContent = (text: string) => {
    const normalized = normalizeDelimiters(text);
    // Split by block math delimiters ($$...$$)
    const blockMathRegex = /\$\$(.*?)\$\$/gs;
    const parts = normalized.split(blockMathRegex);
    
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
            <View key={`block-${i}`} style={styles.katexBlock}>
              <Katex
                expression={parts[i]}
                style={styles.katex}
                inlineStyle={blockStyle}
                displayMode={true}
                throwOnError={false}
                errorColor="#f00"
                macros={{}}
                colorIsTextColor={false}
                onError={() => console.error('KaTeX Block Error')}
              />
            </View>
          );
        }
      }
    }
    
    return elements.length > 0 ? elements : <Text>{text}</Text>;
  };
  
  // Function to process inline math ($...$)
  const renderInlineMath = (text: string) => {
    const inlineMathRegex = /\$(.*?)\$/gs;
    const parts = text.split(inlineMathRegex);
    
    if (parts.length === 1) {
      // No $...$ found. Heuristic: render as math if looks like LaTeX
      const looksLikeLatex = /\\[a-zA-Z]+|\\frac|\\sqrt|\\int|\\sum|\\pi|\\theta|\\alpha/.test(text);
      if (looksLikeLatex) {
        return (
          <View style={styles.katexInline}>
            <Katex
              expression={text}
              style={styles.katex}
              inlineStyle={inlineStyle}
              displayMode={false}
              throwOnError={false}
              errorColor="#f00"
              macros={{}}
              colorIsTextColor={false}
              onError={() => console.error('KaTeX Inline Heuristic Error')}
            />
          </View>
        );
      }
      // Otherwise return plain text
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
            <View key={`inline-math-${i}`} style={styles.katexInline}>
              <Katex
                expression={parts[i]}
                style={styles.katex}
                inlineStyle={inlineStyle}
                displayMode={false}
                throwOnError={false}
                errorColor="#f00"
                macros={{}}
                colorIsTextColor={false}
                onError={() => console.error('KaTeX Inline Error')}
              />
            </View>
          );
        }
      }
    }
    
    return (
      <View style={styles.textContainer}>
        {elements}
      </View>
    );
  };

  return (
    <View className={className}>
      {renderContent(content)}
    </View>
  );
}
