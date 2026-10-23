/*
 * Everything the site says lives in this file. All three styles (modern, 2000s, 90s)
 * read from it, so edit here and every style updates.
 *
 * Dates on the timeline are decimal years: 2021.5 is roughly July 2021.
 * A role with end: null is still going.
 */
window.SITE = {
  profile: {
    name: 'Muhammad Bilal',
    short: 'Bilal',
    tagline: 'AI research scientist and engineering leader. I help teams take AI from the demo to something people rely on.',
    bio: [
      'At KAUST I work on AI for science and the systems that run AI: ARK, an AI research harness; serving for agentic LLM apps; and web retrieval built for AI.',
      'Before that I spent four years at Unbabel leading the AI Ops, AI productisation and model deployment teams. My PhD was on configuring cloud systems automatically, so that jobs run fast without overspending.',
    ],
  },

  links: {
    email: 'muhammad.bilal@kaust.edu.sa',
    github: 'https://github.com/MBtech',
    scholar: 'https://scholar.google.com/citations?user=HlNg0VwAAAAJ',
    medium: 'https://medium.com/@thelearningfellow',
    leadershift: 'https://www.leadershiftstudio.com/muhammad-bilal',
    soko: 'https://soko.fyi/',
  },

  now: [
    { role: 'Consulting AI Research Scientist', org: 'KAUST', since: 'Jul 2025' },
    { role: 'Technical Advisor', org: 'Soko', orgUrl: 'https://soko.fyi/', note: 'a local guide app', since: 'May 2026' },
    { role: 'Fractional AI leader', org: 'On my own, or with a wider team through The Leadershift Studio', since: null },
  ],

  services: {
    intro: 'Senior AI leadership for founders, executives and research leaders, without hiring a full-time CTO or Head of AI.',
    items: [
      { title: 'Deciding where AI fits', text: 'Matching AI to real workflows, and choosing whether to build, buy or partner.' },
      { title: 'Shipping AI and LLM systems', text: 'Turning prototypes into reliable services that don’t depend on one vendor or model.' },
      { title: 'Cutting AI cost', text: 'Lower model and infrastructure spend, with a repeatable way to evaluate options.' },
      { title: 'Leading AI teams', text: 'Hiring, code review, onboarding and growth plans, as a fractional or interim lead.' },
      { title: 'AI for research', text: 'Agents with memory for literature review and R&D, with people kept in the loop.' },
    ],
    solo: { title: 'Just me', text: 'For AI engineering work. One senior person working with you directly.', cta: 'Email me' },
    team: { title: 'A wider team', text: 'For a range of expertise, including Growth, People Ops, Strategy and AI Law, through The Leadershift Studio.', cta: 'Go to The Leadershift Studio' },
  },

  // Things I build on the side. tools: smaller apps listed under a project.
  projects: {
    intro: 'Things I build on the side, mostly for researchers and developers.',
    items: [
      {
        name: 'PaperBoy', url: 'https://paperboy.tangents.fyi/', tagline: 'The latest research, on your desk by morning.',
        text: 'A Slack app that finds new computer science papers on arXiv and Semantic Scholar, ranks them by how well they fit each channel’s topic, and posts each one as its own thread. People without Slack can get a weekly email instead.',
      },
      {
        name: 'tangents', url: 'https://tangents.fyi/', tagline: 'Small tools for researchers and developers.',
        text: 'A collection of small apps, each built to do one job well.',
        tools: [
          { name: 'GPU Memory Estimator', url: 'https://gpusize.tangents.fyi/', text: 'How much GPU memory a Hugging Face model needs' },
          { name: 'Dependency Risk Score', url: 'https://depscore.tangents.fyi/', text: 'How likely an npm or PyPI package is to be abandoned' },
          { name: 'Premortem', url: 'https://premortem.tangents.fyi/', text: 'Find the risks in a project plan before you start' },
          { name: 'Citation Network', url: 'https://cnetwork.tangents.fyi/', text: 'See how papers cite each other' },
          { name: 'Vazeer', url: 'https://vazeer.tangents.fyi/', text: 'An AI peer reviewer for paper drafts' },
          { name: 'Reference Verifier', url: 'https://refcheck.tangents.fyi/', text: 'Catch made-up or wrong references in a paper' },
          { name: 'Feynman', url: 'https://feynman.tangents.fyi/', text: 'Learn a topic by teaching it to an AI student' },
          { name: 'Outofbox', url: 'https://outofbox.tangents.fyi/', text: 'Prompts and limits that push creative thinking' },
          { name: 'ShillBot 3000', url: 'https://shillbot.tangents.fyi/', text: 'A research demo of a chatbot that slips in hidden ads' },
          { name: 'Blog', url: 'https://blog.tangents.fyi/', text: 'Notes from building the tools' },
        ],
      },
    ],
  },

  // The Recycle Bin: things I have let go of, and why. Newest first.
  // when: shown in the "Deleted" column. restore (optional): a link ({ label, url }) or a window to open
  // ({ label, open: 'papers' | 'reading', search: 'words to search for' }).
  bin: {
    intro: 'Things I’ve let go of, and why. Each one taught me something.',
    items: [
      { name: 'My old website', type: 'Website', when: 'Oct 2026', why: 'A ready-made blog theme that looked like everyone else’s. This desktop replaced it.', restore: { label: 'See it on GitHub', url: 'https://github.com/MBtech/mbtech.github.io/tree/e8d4cc0' } },
      { name: 'The “demo to dependable” simulator', type: 'Program', when: 'Oct 2026', why: 'An early version of this site had a pipeline you could tune with dials. Nobody could tell what the dials did, so it went.' },
      { name: 'Pixel-art avatar', type: 'Picture', when: 'Oct 2026', why: 'Didn’t make the cut. The pop-art portrait in About me took its place.' },
      { name: 'Senior Engineer', type: 'Job title', when: 'Unbabel', why: 'Traded for Senior Engineering Manager. My job became helping other people do their best work.' },
      { name: 'Steganography', type: 'Research topic', when: '2014', why: 'My first two papers hid messages inside images. I moved to distributed systems for my master’s and never went back.', restore: { label: 'Show the papers', open: 'papers', search: 'steganography' } },
      { name: 'Texas Ranger, The President Is Missing', type: 'Books', why: 'The only two books on my reading list that I don’t recommend.', restore: { label: 'Find them', open: 'reading', search: 'Patterson' } },
    ],
  },

  // lane: industry | research | education
  roles: [
    { id: 'soko', lane: 'industry', title: 'Technical Advisor', org: 'Soko', when: 'May 2026 – now', spans: [[2026.33, null]], detail: 'Advising a local guide app.' },
    { id: 'unbabel', lane: 'industry', title: 'Senior Engineer → Senior Engineering Manager', short: 'Sr Eng Manager', org: 'Unbabel', when: 'Jul 2021 – May 2025', spans: [[2021.5, 2025.35]], detail: 'Joined as Senior Engineer, became Senior Engineering Manager. Led AI Ops, AI productisation and model deployment.' },
    { id: 'kaust', lane: 'research', title: 'Consulting AI Research Scientist', short: 'AI Research Scientist', org: 'KAUST', when: 'Jul 2025 – now', spans: [[2025.5, null]], detail: 'AI for science (ARK, an AI research harness), serving agentic LLM apps, AI-native web retrieval.' },
    { id: 'kth', lane: 'research', title: 'Research Engineer (part-time)', short: 'Research Engineer', org: 'KTH', when: '2020 – 2021', spans: [[2020.35, 2021.95]], detail: 'Part-time, alongside the end of the PhD.' },
    { id: 'kaust-visit', lane: 'research', title: 'Visiting PhD Student', org: 'KAUST', when: '2017, 2018', spans: [[2017, 2017.4], [2018, 2018.4]], detail: 'Two research visits, January to May each year.' },
    { id: 'telefonica', lane: 'research', title: 'Research Intern', org: 'Telefónica Research', when: '2015', spans: [[2015.1, 2015.55]], detail: 'Telefónica Research, Barcelona.' },
    { id: 'phd', lane: 'education', title: 'PhD in Distributed Computing', short: 'PhD', org: 'UCLouvain + IST', when: '2015 – 2021', spans: [[2015.7, 2021.5]], detail: 'Advised by Marco Canini and Rodrigo Rodrigues. Thesis: Automatic configuration for cloud workloads.' },
    { id: 'msc', lane: 'education', title: 'MSc in Distributed Computing', short: 'MSc', org: 'UPC + KTH', when: '2013 – 2015', spans: [[2013.7, 2015.5]], detail: 'Joint master’s in distributed computing.' },
    { id: 'bsc', lane: 'education', title: 'BSc in Computer Engineering', short: 'BSc', org: 'COMSATS', when: '2008 – 2012', spans: [[2008.7, 2012.5]], detail: 'Computer engineering, Islamabad.' },
  ],

  scholar: { citations: 411, hIndex: 9, asOf: 'Oct 2026' },

  // older: true hides the paper behind "show older papers". cites: null means Scholar has no count yet.
  papers: [
    { year: 2026, venue: 'ICML-W', venueFull: 'ICML 2026 AI for Science Workshop', title: 'ARK: AI Research Harness – Offload the Labour, Steer the Science', authors: 'J. Xin, Y. Luo, M. Bilal, M. Canini', cites: 0, url: 'https://icml.cc/virtual/2026/78388' },
    { year: 2026, venue: 'APSys', venueFull: 'ACM SIGOPS Asia-Pacific Workshop on Systems (APSys)', title: 'Congestion-Aware Serving of Agentic LLM Applications', authors: 'M. B. Nasr, M. Bilal, A. Cornacchia, B. Radovic, M. Canini', cites: null, url: '' },
    { year: 2026, venue: 'NSDI', venueFull: 'USENIX NSDI', title: 'Observability Is Eating Your Cores: Fine-Grained Analysis of Microservice Metrics with IPU-Hosted Sketches', authors: 'A. Cornacchia, T. A. Benson, M. Bilal, M. Canini', cites: 2, url: 'https://www.usenix.org/conference/nsdi26/presentation/cornacchia' },
    { year: 2025, venue: 'arXiv', venueFull: 'arXiv', title: 'Toward an AI-Native Internet: Rethinking the Web Architecture for Semantic Retrieval', authors: 'M. Bilal, Z. Qazi, M. Canini', cites: 1, url: 'https://arxiv.org/abs/2511.18354' },
    { year: 2025, venue: 'SAA', venueFull: 'Workshop on Systems for Agentic AI (SAA ’25)', title: 'DMAS-Forge: A Framework for Transparent Deployment of AI Applications as Distributed Systems', authors: 'A. Cornacchia, V. Anand, M. Bilal, Z. Qazi, M. Canini', cites: 1, url: 'https://arxiv.org/abs/2510.11872' },
    { year: 2023, venue: 'EuroSys', venueFull: 'ACM EuroSys', title: 'With Great Freedom Comes Great Opportunity: Rethinking Resource Allocation for Serverless Functions', authors: 'M. Bilal, M. Canini, R. Fonseca, R. Rodrigues', cites: 95, url: 'https://doi.org/10.1145/3552326.3567506' },
    { year: 2023, venue: 'CoNEXT', venueFull: 'ACM CoNEXT 2023 (short paper)', title: 'MicroView: Cloud-Native Observability with Temporal Precision', authors: 'A. Cornacchia, T. A. Benson, M. Bilal, M. Canini', cites: 2, url: 'https://doi.org/10.1145/3630202.3630233' },
    { year: 2022, venue: 'PhD', venueFull: 'PhD thesis, UCLouvain', title: 'Automatic Configuration for Cloud Workloads', authors: 'M. Bilal', cites: 2, url: 'https://dial.uclouvain.be/pr/boreal/object/boreal:264197', older: true },
    { year: 2021, venue: 'arXiv', venueFull: 'arXiv', title: 'On the Impact of Device and Behavioral Heterogeneity in Federated Learning', authors: 'A. M. Abdelmoniem, C.-Y. Ho, P. Papageorgiou, M. Bilal, M. Canini', cites: 17, url: 'https://arxiv.org/abs/2102.07500', older: true },
    { year: 2020, venue: 'SoCC', venueFull: 'ACM Symposium on Cloud Computing (SoCC)', title: 'Finding the Right Cloud Configuration for Analytics Clusters', authors: 'M. Bilal, M. Canini, R. Rodrigues', cites: 50, url: '/papers/vanir.socc20.pdf' },
    { year: 2020, venue: 'VLDB', venueFull: 'Proceedings of the VLDB Endowment', title: 'Do the Best Cloud Configurations Grow on Trees? An Experimental Evaluation of Black Box Algorithms for Optimizing Cloud Workloads', short: 'Do the Best Cloud Configurations Grow on Trees?', authors: 'M. Bilal, M. Serafini, M. Canini, R. Rodrigues', cites: 33, url: '/papers/1374-Bilal.pdf' },
    { year: 2018, venue: 'WWW', venueFull: 'The Web Conference (WWW)', title: 'Chimp: Crowdsourcing Human Inputs for Mobile Phones', authors: 'M. Almeida, M. Bilal, A. Finamore, I. Leontiadis, Y. Grunenberger, M. Varvello, J. Blackburn', cites: 42, url: '/papers/chimp.pdf', older: true },
    { year: 2018, venue: 'DEBS', venueFull: 'ACM Conference on Distributed and Event-Based Systems (DEBS)', title: 'Mitigating Network Side Channel Leakage for Stream Processing Systems in Trusted Execution Environments', short: 'Mitigating Network Side Channel Leakage for Stream Processing Systems in TEEs', authors: 'M. Bilal, H. Alsibyani, M. Canini', cites: 6, url: 'https://sands.kaust.edu.sa/publication/bilal-debs-18/', older: true },
    { year: 2017, venue: 'SoCC', venueFull: 'ACM Symposium on Cloud Computing (SoCC)', title: 'Towards Automatic Parameter Tuning of Stream Processing Systems', authors: 'M. Bilal, M. Canini', cites: 84, url: '/papers/socc17.pdf' },
    { year: 2016, venue: 'PAM', venueFull: 'Passive and Active Measurement Conference (PAM)', title: 'An Empirical Study of Android Alarm Usage for Application Scheduling', authors: 'M. Almeida, M. Bilal, J. Blackburn, K. Papagiannaki', cites: 9, url: 'https://www.marioalmeida.com/assets/PAM16_50-almeida.pdf', older: true },
    { year: 2014, venue: 'MTAP', venueFull: 'Multimedia Tools and Applications', title: 'Chaos Based Zero-Steganography Algorithm', authors: 'M. Bilal, S. Imtiaz, W. Abdul, S. Ghouzali, S. Asif', cites: 47, url: '', older: true },
    { year: 2013, venue: 'AICCSA', venueFull: 'ACS/IEEE AICCSA', title: 'Zero-Steganography Using DCT and Spatial Domain', authors: 'M. Bilal, S. Imtiaz, W. Abdul, S. Ghouzali', cites: 19, url: '', older: true },
  ],

  // From the old reading page. rec: 'high' = highly recommended, 'no' = not recommended.
  // reading: books I'm reading now, shown in the "Currently reading" widget. Move them to a shelf when done.
  books: {
    reading: [
      { title: 'The Dark Forest', author: 'Cixin Liu' },
      { title: 'Will My Cat Eat My Eyeballs?', author: 'Caitlin Doughty' },
      { title: 'Incidents Around the House', author: 'Josh Malerman' },
    ],
    note: 'Books I have read, roughly in order of how much I recommend them. A high recommendation doesn’t mean I agree with everything in the book, only that the perspective is worth hearing. The list is missing a few dozen books.',
    shelves: [
      { name: 'Finance and economics', books: [
        { title: 'Misbehaving: The Making of Behavioral Economics', author: 'Richard H. Thaler', rec: 'high' },
        { title: 'A Random Walk Down Wall Street', author: 'Burton G. Malkiel', rec: 'high' },
        { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', rec: 'high' },
        { title: 'Markets Never Forget (But People Do)', author: 'Ken Fisher and Lara Hoffmans', rec: 'high' },
        { title: 'The Myth of Capitalism', author: 'Jonathan Tepper', rec: 'high' },
        { title: 'Freakonomics', author: 'Steven D. Levitt and Stephen J. Dubner' },
        { title: 'The Little Book That Still Beats the Market', author: 'Joel Greenblatt' },
        { title: 'How to Manage Your Money When You Don’t Have Any', author: 'Erik Wecks' },
      ] },
      { name: 'Psychology', books: [
        { title: 'Mistakes Were Made (but Not by Me)', author: 'Carol Tavris and Elliot Aronson', rec: 'high' },
        { title: 'The Paradox of Choice', author: 'Barry Schwartz', rec: 'high' },
        { title: 'Never Split the Difference', author: 'Chris Voss and Tahl Raz', rec: 'high' },
        { title: 'Leaders Eat Last', author: 'Simon Sinek' },
        { title: 'The Infinite Game', author: 'Simon Sinek' },
        { title: 'Quirkology', author: 'Richard Wiseman' },
        { title: 'Surrounded by Idiots', author: 'Thomas Erikson' },
      ] },
      { name: 'Business and marketing', books: [
        { title: 'Oversubscribed', author: 'Daniel Priestley' },
        { title: 'The Membership Economy', author: 'Robbie Kellman Baxter' },
        { title: 'Chaos Monkeys', author: 'Antonio García Martínez' },
      ] },
      { name: 'Technology and science', books: [
        { title: 'Prediction Machines', author: 'Ajay Agrawal, Joshua Gans and Avi Goldfarb' },
        { title: 'Algorithms to Live By', author: 'Brian Christian and Tom Griffiths' },
        { title: 'How To', author: 'Randall Munroe' },
      ] },
      { name: 'Other non-fiction', books: [
        { title: 'Surely You’re Joking, Mr. Feynman!', author: 'Richard Feynman', rec: 'high' },
        { title: 'Profit Over People', author: 'Noam Chomsky' },
        { title: 'A More Beautiful Question', author: 'Warren Berger' },
        { title: 'The Panama Papers', author: 'Frederik Obermaier and Bastian Obermayer' },
        { title: 'Bad Blood', author: 'John Carreyrou' },
        { title: 'Ethics in the Real World', author: 'Peter Singer' },
        { title: 'Born a Crime', author: 'Trevor Noah' },
        { title: 'The View from the Cheap Seats', author: 'Neil Gaiman' },
        { title: 'Deep Survival', author: 'Laurence Gonzales' },
        { title: 'How They Rule the World', author: 'Pedro Baños' },
        { title: 'Rivals! Frenemies Who Changed the World', author: 'Scott McCormick' },
        { title: 'Superforecasting', author: 'Philip Tetlock and Dan Gardner' },
        { title: 'Everything Is F*cked: A Book About Hope', author: 'Mark Manson' },
        { title: 'Poorly Made in China', author: 'Paul Midler' },
        { title: 'Moonwalking with Einstein', author: 'Joshua Foer' },
        { title: 'The Demon Next Door', author: 'Bryan Burrough' },
      ] },
      { name: 'Fiction', books: [
        { title: '1984', author: 'George Orwell', rec: 'high' },
        { title: 'The Handmaid’s Tale', author: 'Margaret Atwood', rec: 'high' },
        { title: 'The Testaments', author: 'Margaret Atwood', rec: 'high' },
        { title: 'Nation', author: 'Terry Pratchett' },
        { title: 'Harry Potter series', author: 'J.K. Rowling' },
        { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
        { title: 'Neverwhere', author: 'Neil Gaiman' },
        { title: 'American Gods', author: 'Neil Gaiman' },
        { title: 'The Dark Tower series', author: 'Stephen King' },
        { title: 'The Ocean at the End of the Lane', author: 'Neil Gaiman' },
        { title: 'Metro series', author: 'Dmitry Glukhovsky' },
        { title: 'The Midnight Library', author: 'Matt Haig' },
        { title: 'Thirteen Storeys', author: 'Jonathan Sims' },
        { title: '#1 in Customer Service', author: 'Larry Correia' },
        { title: 'Paradox Bound', author: 'Peter Clines' },
        { title: 'Norse Mythology', author: 'Neil Gaiman' },
        { title: 'Good Omens', author: 'Terry Pratchett and Neil Gaiman' },
        { title: 'Lock In', author: 'John Scalzi' },
        { title: 'IT', author: 'Stephen King' },
        { title: 'Lovecraft Country', author: 'Matt Ruff' },
        { title: 'The Last Colony', author: 'John Scalzi' },
        { title: 'The Green Mile', author: 'Stephen King' },
        { title: 'Dodger', author: 'Terry Pratchett' },
        { title: 'The Long Earth series', author: 'Terry Pratchett and Stephen Baxter' },
        { title: 'The Mist', author: 'Stephen King' },
        { title: 'Agent to the Stars', author: 'John Scalzi' },
        { title: 'Revival', author: 'Stephen King' },
        { title: 'Jurassic Park', author: 'Michael Crichton' },
        { title: 'The Dispatcher', author: 'John Scalzi' },
        { title: 'Will Save the Galaxy for Food', author: 'Yahtzee Croshaw' },
        { title: 'More Bedtime Stories for Cynics', author: '' },
        { title: 'The Hunger Games series', author: 'Suzanne Collins' },
        { title: 'The Lost Causes of Bleak Creek', author: 'Rhett McLaughlin and Link Neal' },
        { title: 'Treasure Island', author: 'Robert Louis Stevenson' },
        { title: 'The Adventures of Tom Stranger, Interdimensional Insurance Agent', author: 'Larry Correia' },
        { title: 'Artemis', author: 'Andy Weir' },
        { title: 'Terminal World', author: 'Alastair Reynolds' },
        { title: 'Permafrost', author: 'Alastair Reynolds' },
        { title: 'Sphere', author: 'Michael Crichton' },
        { title: 'The Man in the High Castle', author: 'Philip K. Dick' },
        { title: 'The Sisters', author: 'Dervla McTiernan' },
        { title: 'Camp Red Moon', author: 'R.L. Stine' },
        { title: 'The Andromeda Strain', author: 'Michael Crichton' },
        { title: 'Strange Houses', author: 'Uketsu' },
        { title: 'The Three-Body Problem', author: 'Cixin Liu' },
        { title: 'Katabasis', author: 'R.F. Kuang' },
        { title: 'Never Let Me Go', author: 'Kazuo Ishiguro' },
        { title: 'Head On', author: 'John Scalzi' },
        { title: 'Trigger Warning', author: 'Neil Gaiman' },
        { title: 'Yesteryear', author: 'Caro Claire Burke' },
        { title: 'Texas Ranger', author: 'James Patterson and Andrew Bourelle', rec: 'no' },
        { title: 'The President Is Missing', author: 'Bill Clinton and James Patterson', rec: 'no' },
      ] },
    ],
  },
};
