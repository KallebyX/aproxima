# Security Policy

## Reporting Security Vulnerabilities

The Aproxima team takes security seriously. We appreciate your efforts to responsibly disclose any security vulnerabilities you may find.

### How to Report

Please report security vulnerabilities by emailing: **security@aproxima.com.br**

**Do not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### What to Include

Please include as much information as possible:

- Type of vulnerability (e.g., XSS, CSRF, injection, etc.)
- Affected components (URLs, parameters, etc.)
- Step-by-step reproduction instructions
- Proof of concept or exploit code (if available)
- Potential impact of the vulnerability
- Suggested mitigation or fix (if any)

### Response Timeline

We aim to acknowledge receipt of vulnerability reports within **24 hours** and will strive to keep you informed throughout the process.

Our response timeline:
- **24 hours**: Acknowledgment of report
- **72 hours**: Initial assessment and severity classification
- **7 days**: Regular updates on investigation progress
- **30 days**: Target resolution for critical vulnerabilities

### Severity Classification

We use the following severity levels:

- **Critical**: Immediate threat to user data or system security
- **High**: Significant security impact affecting multiple users
- **Medium**: Moderate security impact with limited scope
- **Low**: Minor security issues with minimal impact

### Security Measures

This project implements multiple security layers:

#### Web Application Security
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options and X-Content-Type-Options headers
- Input validation and sanitization
- Rate limiting protection
- CSRF protection
- XSS prevention measures

#### Infrastructure Security
- Regular security updates
- Dependency vulnerability scanning
- Docker container security
- Secrets management
- Access logging and monitoring

#### Compliance
- LGPD (Brazilian Data Protection Law) compliance
- OWASP Top 10 protection measures
- WCAG 2.1 AA accessibility standards
- Regular security audits

### Supported Versions

Security updates are provided for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Yes             |
| 1.x.x   | ❌ No              |

### Security Disclosure Policy

- We will investigate all legitimate reports and do our best to quickly fix the problem
- We will provide credit to reporters unless anonymity is requested
- We will not pursue legal action against researchers who follow responsible disclosure
- We may publish security advisories for significant vulnerabilities

### Bug Bounty

Currently, we do not offer a formal bug bounty program, but we greatly appreciate security research and responsible disclosure.

### Contact Information

For any security-related questions or concerns:

- **Email**: security@aproxima.com.br
- **Emergency**: dpo@aproxima.com.br
- **General Contact**: contato@aproxima.com.br

---

**Last Updated**: {current_date}
**Policy Version**: 1.0