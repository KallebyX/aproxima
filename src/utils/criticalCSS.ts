// 🚀 APROXIMA - Critical CSS Extractor & Optimizer
// FASE 3: Critical CSS extraction, purging, optimization

import { useState, useEffect, useCallback } from 'react';

export class CriticalCSSExtractor {
  private criticalCSS: Map<string, string> = new Map();
  private extractedRules: Set<string> = new Set();
  private usedSelectors: Set<string> = new Set();
  private unusedSelectors: Set<string> = new Set();
  private aboveFoldElements: Set<Element> = new Set();
  private purgedCSS: Map<string, string> = new Map();
  private viewport = { width: 1920, height: 1080 };

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    this.updateViewport();
    window.addEventListener('resize', () => this.updateViewport());

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.extractCriticalCSS();
        this.analyzeFoldElements();
        this.purgeUnusedCSS();
      });
    } else {
      this.extractCriticalCSS();
      this.analyzeFoldElements();
      this.purgeUnusedCSS();
    }
  }

  private updateViewport(): void {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  private async purgeUnusedCSS(): Promise<void> {
    const route = typeof window !== 'undefined' ? window.location.pathname : '/';
    const allStyleSheets = Array.from(document.styleSheets);
    const allRules: CSSRule[] = [];
    
    allStyleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        allRules.push(...rules);
      } catch (e) {
        console.warn('Cannot access stylesheet rules:', e);
      }
    });

    const usedSelectors = new Set<string>();
    const unusedSelectors = new Set<string>();

    allRules.forEach(rule => {
      if (rule instanceof CSSStyleRule) {
        const selector = rule.selectorText;
        
        try {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            usedSelectors.add(selector);
            this.usedSelectors.add(selector);
          } else {
            unusedSelectors.add(selector);
            this.unusedSelectors.add(selector);
          }
        } catch (e) {
          unusedSelectors.add(selector);
          this.unusedSelectors.add(selector);
        }
      }
    });

    const purgedCSS = this.createPurgedCSS(allRules, usedSelectors);
    this.purgedCSS.set(route, purgedCSS);
    console.log(`🧹 CSS Purged for ${route}: ${unusedSelectors.size} unused selectors removed`);
  }

  private createPurgedCSS(rules: CSSRule[], usedSelectors: Set<string>): string {
    const purgedRules: string[] = [];
    
    rules.forEach(rule => {
      if (rule instanceof CSSStyleRule) {
        if (usedSelectors.has(rule.selectorText)) {
          purgedRules.push(rule.cssText);
        }
      } else if (rule instanceof CSSMediaRule || rule instanceof CSSKeyframesRule) {
        purgedRules.push(rule.cssText);
      }
    });

    return purgedRules.join('\n');
  }

  private analyzeFoldElements(): void {
    const foldHeight = this.viewport.height;
    const elements = document.querySelectorAll('*');
    
    this.aboveFoldElements.clear();
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isAboveFold = rect.top < foldHeight && rect.bottom > 0;
      
      if (isAboveFold) {
        this.aboveFoldElements.add(element);
      }
    });

    console.log(`📐 Above-the-fold analysis: ${this.aboveFoldElements.size} elements identified`);
  }

  public async extractCriticalCSS(): Promise<string> {
    const route = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    if (this.criticalCSS.has(route)) {
      return this.criticalCSS.get(route)!;
    }

    console.log(`🎨 Extracting critical CSS for route: ${route}`);

    try {
      this.analyzeFoldElements();
      const criticalRules = await this.analyzeCriticalStyles();
      const optimizedCSS = this.optimizeCriticalCSS(criticalRules);
      
      this.criticalCSS.set(route, optimizedCSS);
      this.inlineCriticalCSS(optimizedCSS);
      
      console.log(`✅ Critical CSS extraction completed for ${route}: ${optimizedCSS.length} chars`);
      return optimizedCSS;
    } catch (error) {
      console.error('Critical CSS extraction failed:', error);
      return '';
    }
  }

  private async analyzeCriticalStyles(): Promise<CSSRule[]> {
    const criticalRules: CSSRule[] = [];
    const processedSelectors = new Set<string>();
    const stylesheets = Array.from(document.styleSheets);

    for (const stylesheet of stylesheets) {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText;
            
            if (processedSelectors.has(selector)) continue;
            processedSelectors.add(selector);

            if (this.isCriticalSelector(selector)) {
              criticalRules.push(rule);
              this.extractedRules.add(rule.cssText);
            }
          }
        }
      } catch (e) {
        console.warn('Could not access stylesheet:', e);
      }
    }

    return criticalRules;
  }

  private isCriticalSelector(selector: string): boolean {
    try {
      const elements = document.querySelectorAll(selector);
      
      for (const element of Array.from(elements)) {
        if (this.aboveFoldElements.has(element)) {
          return true;
        }
        
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < this.viewport.height && rect.bottom > 0;
        
        if (isVisible) {
          return true;
        }
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  private optimizeCriticalCSS(rules: CSSRule[]): string {
    const cssText = rules.map(rule => rule.cssText).join('\n');
    
    return cssText
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/\s*{\s*/g, '{')
      .replace(/:\s*/g, ':')
      .replace(/,\s*/g, ',')
      .trim();
  }

  private inlineCriticalCSS(css: string): void {
    const existingStyle = document.getElementById('critical-css');
    if (existingStyle) {
      existingStyle.textContent = css;
    } else {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = css;
      document.head.insertBefore(style, document.head.firstChild);
    }
  }

  public getCriticalCSS(route?: string): string {
    const targetRoute = route || (typeof window !== 'undefined' ? window.location.pathname : '/');
    return this.criticalCSS.get(targetRoute) || '';
  }

  public getPurgedCSS(route?: string): string {
    const targetRoute = route || (typeof window !== 'undefined' ? window.location.pathname : '/');
    return this.purgedCSS.get(targetRoute) || '';
  }

  public getStats() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return {
        extractedRules: 0,
        usedSelectors: 0,
        unusedSelectors: 0,
        aboveFoldElements: 0,
        criticalCSSSize: 0,
        purgedCSSSize: 0
      };
    }

    const route = window.location.pathname;
    const criticalCSS = this.criticalCSS.get(route) || '';
    const purgedCSS = this.purgedCSS.get(route) || '';

    return {
      extractedRules: this.extractedRules.size,
      usedSelectors: this.usedSelectors.size,
      unusedSelectors: this.unusedSelectors.size,
      aboveFoldElements: this.aboveFoldElements.size,
      criticalCSSSize: criticalCSS.length,
      purgedCSSSize: purgedCSS.length
    };
  }
}

export const criticalCSSExtractor = new CriticalCSSExtractor();

export function useCSSOptimization() {
  const [criticalCSS, setCriticalCSS] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(false);

  const extractCSS = useCallback(async () => {
    setIsLoading(true);
    try {
      const css = await criticalCSSExtractor.extractCriticalCSS();
      setCriticalCSS(css);
      setIsOptimized(css.length > 0);
    } catch (error) {
      console.error('Critical CSS extraction failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    extractCSS();
  }, [extractCSS]);

  return {
    criticalCSS,
    isLoading,
    isOptimized,
    extractCSS,
    getCriticalCSS: (route?: string) => criticalCSSExtractor.getCriticalCSS(route),
    getPurgedCSS: (route?: string) => criticalCSSExtractor.getPurgedCSS(route),
    stats: criticalCSSExtractor.getStats()
  };
}



export default criticalCSSExtractor;
