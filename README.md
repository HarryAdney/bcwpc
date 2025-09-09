# Burton-cum-Walden Parish Council Website

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official website for Burton-cum-Walden Parish Council in West Burton, North Yorkshire. Built with accessibility, performance, and user experience at its core, serving the local community with essential information and services.

## 🏛️ About Burton-cum-Walden Parish Council

West Burton is considered one of the most beautiful villages in the Yorkshire Dales National Park, featuring a large village green and no through road. This website serves the local community by providing:

- Parish Council information and meeting minutes
- Local services and contact details
- Village events and community calendar
- Historical information about West Burton
- Emergency planning and public notices

## ✨ Features

### 🎯 Core Functionality
- **Parish Council Management**: Meeting minutes, agendas, and council information
- **Village Events System**: Dynamic events calendar with content management
- **Local Services Directory**: Comprehensive local business and service listings
- **Document Management**: Public notices, reports, and official documents
- **Community Information**: History, accommodation, and visitor information

### 🌐 Technical Features
- **Astro 5+** - Modern static site generation
- **Content Collections** - Structured content management for events, minutes, and projects
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessibility First** - WCAG 2.1 AA compliant with comprehensive a11y features
- **SEO Optimized** - Meta tags, structured data, and performance optimization
- **Fast Performance** - Excellent Lighthouse scores across all metrics

### ♿ Accessibility Features
- Semantic HTML landmarks (`header`, `main`, `footer`, `nav`, `section`)
- ARIA attributes for enhanced screen reader support
- Keyboard navigation support throughout
- Focus indicators that work on light and dark backgrounds
- Screen reader only content with `.sr-only` utility class
- Respects `prefers-reduced-motion` user preferences
- High contrast ratios and readable typography
- Accessible form controls and navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarryAdney/b-c-w-accessible.git
   cd b-c-w-accessible
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

### Available Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321` |
| `npm run build`   | Build your production site to `./dist/`     |
| `npm run preview` | Preview your build locally, before deploying |

## 📁 Project Structure

```
/
├── public/                 # Static assets
│   ├── documents/         # PDF documents and public notices
│   ├── fonts/            # Web fonts
│   └── *.webp           # Optimized images
├── src/
│   ├── assets/           # SCSS styles and assets
│   ├── components/       # Reusable Astro components
│   ├── content/          # Content collections
│   │   ├── events/       # Village events (markdown)
│   │   ├── minutes/      # Council minutes (markdown)
│   │   └── projects/     # Parish projects (markdown)
│   ├── layouts/          # Page layouts
│   └── pages/            # Site pages and routes
├── astro.config.mjs      # Astro configuration
├── content.config.mjs    # Content collections schema
└── tailwind.config.cjs   # Tailwind CSS configuration
```

## 📝 Content Management

### Adding Village Events

1. Create a new markdown file in `src/content/events/`
2. Use the following frontmatter structure:

```markdown
---
title: "Event Name"
date: "2025-12-25"
time: "2:00 PM"
location: "Village Hall, West Burton"
description: "Brief description of the event"
organizer: "Event Organizer Name"
category: "Community" # Parish Council, Community, Seasonal, Health
---

Detailed event description in markdown...
```

### Adding Council Minutes

1. Create a new markdown file in `src/content/minutes/`
2. Use the following frontmatter structure:

```markdown
---
title: "Parish Council Minutes for [Date]"
author: "Clerk Name"
chairman: "Chairman Name"
description: "Meeting minutes description"
dated: "2025-01-07"
---

Meeting minutes content in markdown...
```

### Managing Documents

- Add PDF documents to `public/documents/`
- Organize by type: `public_notices/`, `minutes/`, `reports/`
- Reference in pages using relative paths: `/documents/filename.pdf`

## 🎨 Styling and Theming

The website uses Tailwind CSS with custom SCSS for enhanced styling:

- **Base styles**: `src/assets/scss/base/`
- **Component styles**: Defined within Astro components
- **Utility classes**: Tailwind CSS utilities
- **Accessibility utilities**: Custom a11y classes in base styles

### Color Scheme
- **Primary**: Blue tones for official elements
- **Secondary**: Green for community elements
- **Accent**: Purple for seasonal events
- **Neutral**: Grays for text and backgrounds

## 🔧 Configuration

### Site Configuration
Edit `astro.config.mjs` for:
- Site URL and base path
- Build output settings
- Integration configurations

### Content Schema
Edit `content.config.mjs` to modify:
- Content collection schemas
- Validation rules
- Field requirements

## 🌍 Deployment

The site is optimized for static hosting platforms:

1. **Build the site**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting platform:
   - Netlify
   - Vercel
   - GitHub Pages
   - Traditional web hosting

## 📊 Performance

The website is optimized for excellent performance:
- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: WebP format with proper sizing
- **Code Splitting**: Automatic with Astro
- **Minimal JavaScript**: Only where necessary

## 🤝 Contributing

We welcome contributions to improve the website:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow accessibility best practices
- Test with screen readers when possible
- Maintain responsive design principles
- Write semantic HTML
- Keep performance in mind

## 📞 Support

For technical issues or questions about the website:

- **Parish Council**: [clerk@burtoncumwalden-pc.gov.uk](mailto:clerk@burtoncumwalden-pc.gov.uk)
- **Web Development**: [HarryAdney Web Design](https://harryadney.com)
- **Issues**: [GitHub Issues](https://github.com/HarryAdney/b-c-w-accessible/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Accessible Astro Starter** - Foundation template by [Incluud](https://github.com/incluud)
- **Astro Team** - For the amazing static site generator
- **Burton-cum-Walden Parish Council** - For their commitment to digital accessibility
- **West Burton Community** - For their ongoing support and feedback

## 🏘️ About West Burton

West Burton is a picturesque village in the Yorkshire Dales National Park, known for:
- Large village green with no through road
- Historic stone buildings and traditional architecture
- Famous Cauldron Falls (painted by Turner)
- Strong sense of community and local traditions
- Beautiful walking routes and natural scenery

Visit [westburton-yorkshire.org.uk](https://westburton-yorkshire.org.uk) to explore our village online.

---

**Built with ❤️ for the West Burton community**