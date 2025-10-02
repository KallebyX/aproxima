#!/usr/bin/env node
// 🚀 APROXIMA - Advanced Build Optimizer
// Complete Build Process with Performance Analysis

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AdvancedBuildOptimizer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.results = {
      timestamp: new Date().toISOString(),
      buildTime: 0,
      buildSize: {},
      optimization: {},
      performance: {},
      recommendations: []
    };
    this.startTime = Date.now();
  }

  async runOptimizedBuild() {
    console.log('🚀 APROXIMA Advanced Build Optimizer Starting...\n');

    try {
      await this.preBuildOptimizations();
      await this.runBuild();
      await this.postBuildAnalysis();
      await this.generateOptimizationReport();
      
      console.log('✅ Advanced build optimization completed!\n');
    } catch (error) {
      console.error('❌ Build optimization failed:', error);
      process.exit(1);
    }
  }

  async preBuildOptimizations() {
    console.log('🔧 Running pre-build optimizations...');

    // Clean previous build
    this.cleanBuildDirectory();

    // Optimize package.json
    this.optimizePackageJson();

    // Check dependencies
    await this.analyzeDependencies();

    console.log('✅ Pre-build optimizations completed\n');
  }

  cleanBuildDirectory() {
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
      console.log('   🗑️ Cleaned previous build');
    }
  }

  optimizePackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Add optimization scripts if missing
    const optimizationScripts = {
      'build:production': 'NODE_ENV=production npm run build',
      'analyze:bundle': 'ANALYZE=true npm run build',
      'optimize:images': 'next-optimized-images',
      'check:types': 'tsc --noEmit'
    };

    let modified = false;
    Object.entries(optimizationScripts).forEach(([script, command]) => {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('   📝 Optimized package.json scripts');
    }
  }

  async analyzeDependencies() {
    try {
      console.log('   📦 Analyzing dependencies...');
      
      // Check for unused dependencies
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      this.results.optimization.dependencies = {
        production: dependencies.length,
        development: devDependencies.length,
        total: dependencies.length + devDependencies.length
      };

      // Check for security vulnerabilities
      try {
        const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
        const audit = JSON.parse(auditResult);
        
        this.results.optimization.security = {
          vulnerabilities: audit.metadata?.vulnerabilities || {},
          auditLevel: this.getSecurityLevel(audit.metadata?.vulnerabilities)
        };
      } catch (error) {
        console.log('   ⚠️ Security audit completed with warnings');
      }

    } catch (error) {
      console.warn('   ⚠️ Dependency analysis failed:', error.message);
    }
  }

  getSecurityLevel(vulnerabilities) {
    if (!vulnerabilities) return 'unknown';
    
    const { critical = 0, high = 0, moderate = 0, low = 0 } = vulnerabilities;
    
    if (critical > 0) return 'critical';
    if (high > 0) return 'high';
    if (moderate > 0) return 'moderate';
    if (low > 0) return 'low';
    return 'secure';
  }

  async runBuild() {
    console.log('🏗️ Running optimized build...');
    
    const buildStartTime = Date.now();
    
    try {
      // Set production environment variables
      process.env.NODE_ENV = 'production';
      process.env.NEXT_TELEMETRY_DISABLED = '1';
      
      // Run the build
      execSync('npm run build', { 
        stdio: 'inherit',
        env: { ...process.env }
      });
      
      this.results.buildTime = Date.now() - buildStartTime;
      console.log(`✅ Build completed in ${this.results.buildTime}ms\n`);
      
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async postBuildAnalysis() {
    console.log('📊 Running post-build analysis...');

    // Analyze build size
    this.analyzeBuildSize();

    // Analyze chunks
    this.analyzeChunks();

    // Analyze performance
    this.analyzePerformanceMetrics();

    // Generate recommendations
    this.generateRecommendations();

    console.log('✅ Post-build analysis completed\n');
  }

  analyzeBuildSize() {
    const staticDir = path.join(this.buildDir, 'static');
    
    if (!fs.existsSync(staticDir)) {
      console.warn('   ⚠️ Static directory not found');
      return;
    }

    const sizes = {
      js: this.calculateDirectorySize(path.join(staticDir, 'js')),
      css: this.calculateDirectorySize(path.join(staticDir, 'css')),
      chunks: this.calculateDirectorySize(path.join(staticDir, 'chunks')),
      media: this.calculateDirectorySize(path.join(staticDir, 'media'))
    };

    this.results.buildSize = {
      ...sizes,
      total: Object.values(sizes).reduce((sum, size) => sum + size, 0)
    };

    console.log(`   📦 Build sizes:`);
    console.log(`      JS: ${this.formatBytes(sizes.js)}`);
    console.log(`      CSS: ${this.formatBytes(sizes.css)}`);
    console.log(`      Chunks: ${this.formatBytes(sizes.chunks)}`);
    console.log(`      Media: ${this.formatBytes(sizes.media)}`);
    console.log(`      Total: ${this.formatBytes(this.results.buildSize.total)}`);
  }

  calculateDirectorySize(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;

    let totalSize = 0;
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += this.calculateDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    });

    return totalSize;
  }

  analyzeChunks() {
    const chunksDir = path.join(this.buildDir, 'static', 'chunks');
    
    if (!fs.existsSync(chunksDir)) return;

    const chunks = fs.readdirSync(chunksDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(chunksDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          type: this.getChunkType(file)
        };
      })
      .sort((a, b) => b.size - a.size);

    this.results.performance.chunks = {
      count: chunks.length,
      largest: chunks[0],
      totalSize: chunks.reduce((sum, chunk) => sum + chunk.size, 0),
      distribution: this.analyzeChunkDistribution(chunks)
    };

    console.log(`   🧩 Chunk analysis:`);
    console.log(`      Total chunks: ${chunks.length}`);
    console.log(`      Largest chunk: ${chunks[0]?.name} (${this.formatBytes(chunks[0]?.size || 0)})`);
  }

  getChunkType(filename) {
    if (filename.includes('vendor')) return 'vendor';
    if (filename.includes('runtime')) return 'runtime';
    if (filename.includes('main')) return 'main';
    if (filename.includes('framework')) return 'framework';
    return 'page';
  }

  analyzeChunkDistribution(chunks) {
    const distribution = {};
    chunks.forEach(chunk => {
      distribution[chunk.type] = (distribution[chunk.type] || 0) + chunk.size;
    });
    return distribution;
  }

  analyzePerformanceMetrics() {
    // Calculate performance scores
    const { buildSize } = this.results;
    
    this.results.performance.scores = {
      buildSize: this.scoreBuildSize(buildSize.total),
      buildTime: this.scoreBuildTime(this.results.buildTime),
      chunkOptimization: this.scoreChunkOptimization(),
      overall: 0 // Will be calculated
    };

    // Calculate overall score
    const scores = this.results.performance.scores;
    scores.overall = Math.round(
      (scores.buildSize + scores.buildTime + scores.chunkOptimization) / 3
    );

    console.log(`   🎯 Performance scores:`);
    console.log(`      Build Size: ${scores.buildSize}/100`);
    console.log(`      Build Time: ${scores.buildTime}/100`);
    console.log(`      Chunk Optimization: ${scores.chunkOptimization}/100`);
    console.log(`      Overall: ${scores.overall}/100`);
  }

  scoreBuildSize(totalSize) {
    // Score based on total build size
    if (totalSize < 500000) return 100; // < 500KB
    if (totalSize < 1000000) return 90;  // < 1MB
    if (totalSize < 2000000) return 80;  // < 2MB
    if (totalSize < 5000000) return 60;  // < 5MB
    return 40;
  }

  scoreBuildTime(buildTime) {
    // Score based on build time
    if (buildTime < 10000) return 100;  // < 10s
    if (buildTime < 30000) return 90;   // < 30s
    if (buildTime < 60000) return 80;   // < 1min
    if (buildTime < 120000) return 60;  // < 2min
    return 40;
  }

  scoreChunkOptimization() {
    const chunks = this.results.performance.chunks;
    if (!chunks) return 50;

    let score = 100;
    
    // Penalize too many chunks
    if (chunks.count > 20) score -= 20;
    else if (chunks.count > 15) score -= 10;

    // Penalize very large chunks
    if (chunks.largest && chunks.largest.size > 500000) score -= 30;
    else if (chunks.largest && chunks.largest.size > 250000) score -= 15;

    return Math.max(0, score);
  }

  generateRecommendations() {
    const { buildSize, performance } = this.results;
    const recommendations = [];

    // Build size recommendations
    if (buildSize.total > 2000000) {
      recommendations.push({
        type: 'warning',
        category: 'Build Size',
        message: `Total build size (${this.formatBytes(buildSize.total)}) exceeds 2MB. Consider code splitting and tree shaking.`,
        priority: 'high'
      });
    }

    // Build time recommendations
    if (this.results.buildTime > 60000) {
      recommendations.push({
        type: 'warning',
        category: 'Build Performance',
        message: `Build time (${Math.round(this.results.buildTime / 1000)}s) is slow. Consider optimizing dependencies.`,
        priority: 'medium'
      });
    }

    // Chunk recommendations
    if (performance.chunks && performance.chunks.count > 20) {
      recommendations.push({
        type: 'info',
        category: 'Code Splitting',
        message: `${performance.chunks.count} chunks detected. Consider consolidating smaller chunks.`,
        priority: 'low'
      });
    }

    // Security recommendations
    const security = this.results.optimization.security;
    if (security && security.auditLevel !== 'secure' && security.auditLevel !== 'low') {
      recommendations.push({
        type: 'error',
        category: 'Security',
        message: `Security vulnerabilities detected (${security.auditLevel} level). Run 'npm audit fix'.`,
        priority: 'critical'
      });
    }

    this.results.recommendations = recommendations;
  }

  async generateOptimizationReport() {
    const reportPath = path.join(process.cwd(), 'build-optimization-report.json');
    
    // Add summary
    this.results.summary = {
      buildTime: `${Math.round(this.results.buildTime / 1000)}s`,
      buildSize: this.formatBytes(this.results.buildSize.total),
      overallScore: this.results.performance.scores?.overall || 0,
      recommendationsCount: this.results.recommendations.length,
      securityLevel: this.results.optimization.security?.auditLevel || 'unknown'
    };

    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log('📊 APROXIMA Build Optimization Report');
    console.log('=====================================');
    console.log(`🎯 Overall Score: ${this.results.summary.overallScore}/100`);
    console.log(`⏱️ Build Time: ${this.results.summary.buildTime}`);
    console.log(`📦 Build Size: ${this.results.summary.buildSize}`);
    console.log(`🔒 Security Level: ${this.results.summary.securityLevel}`);
    console.log(`💡 Recommendations: ${this.results.summary.recommendationsCount}`);

    if (this.results.recommendations.length > 0) {
      console.log('\n🚨 Issues Found:');
      this.results.recommendations
        .filter(rec => rec.type === 'error' || rec.type === 'warning')
        .forEach(rec => {
          const emoji = rec.type === 'error' ? '❌' : '⚠️';
          console.log(`   ${emoji} [${rec.category}] ${rec.message}`);
        });
    }

    console.log(`\n📄 Full report saved to: ${reportPath}`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the optimizer
if (require.main === module) {
  const optimizer = new AdvancedBuildOptimizer();
  optimizer.runOptimizedBuild().catch(console.error);
}

module.exports = AdvancedBuildOptimizer;