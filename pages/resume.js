import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import ProfileImg from '../public/profile-pic.jpg';
import {
  CV,
  Header,
  Title,
  Talk,
  TalkTitle,
  TalkVenue,
  Contact,
  ResumeSection,
  Go,
  Job,
  JobItem,
  Collapsible,
} from '../components/resume/ResumeComponents';

const Resume = () => (
  <CV>
    <Header>
      <Link href="/">
        <Box width={120} height={120} sx={{ img: { borderRadius: '50%' } }} position="relative">
          <Image src={ProfileImg} layout="fill" />
        </Box>
      </Link>

      <Title>
        Ilya Boyandin
        <h2 className="subtitle">Software Engineer | Interactive Systems & Data Visualization</h2>
      </Title>

      <Contact>
        <Go to="https://twitter.com/ilyabo">@ilyabo</Go>
        <Go to="https://github.com/ilyabo">ilyabo@github</Go>
        <Link href="/">ilya.boyandin.me</Link>
        ilya@boyandin.me
      </Contact>
    </Header>

    <br />

    <div className="summary">
      Experienced software engineer with a PhD in Computer Science and many years of expertise in
      scalable web architectures, interactive front-end development, and data visualization.
      Passionate about leveraging AI and large-scale models to create transformative user
      experiences.
    </div>
    <div className="content">
      <ResumeSection title="Executive Summary" isExpanded>
        <JobItem>
          20+ years of experience in software engineering with deep expertise in data visualization,
          front-end development, distributed systems, and technical leadership.
        </JobItem>
        <JobItem>
          PhD in Computer Science with focus on data visualization and interactive systems.
        </JobItem>
        <JobItem>
          Experience with ML systems including development of statistical classification systems,
          question-answering models, natural language processing for chatbots. Strong background in
          data processing pipelines and real-time ML model integration.
        </JobItem>
        <JobItem>Experience architecting and scaling real-time collaborative systems.</JobItem>
        <JobItem>
          Track record of leading technical teams and mentoring engineers while driving technical
          excellence and innovation. Led development of multiple large-scale web applications
          serving thousands of users.
        </JobItem>
      </ResumeSection>

      <ResumeSection title="Education" isExpanded display="flex" flexDirection="column" gap={2}>
        <Collapsible
          content={
            <span className="em">PhD in Computer Science, University of Fribourg, 2013</span>
          }
          pl={4}
        >
          <span className="flabel">Thesis title:</span> Visualization of Temporal Origin-Destination
          Data
          <br />
          <span className="flabel">Supervised by:</span>{' '}
          <Go to="https://enrico.bertini.io/">Enrico Bertini</Go>,{' '}
          <Go to="https://human-ist.unifr.ch/en/institute/team/denis-lalanne.html">
            Denis Lalanne
          </Go>
          <br />
          <span className="flabel">Summary:</span>
          Carried out an <Go to="/assets/thesis.pdf">in-depth study</Go> of temporal
          origin-destination data which can represent movement of people, energy, material, etc
          between locations in geographic space. Developed <Go to="/p/flowstrates">Flowstrates</Go>,
          a novel approach for visualizing and exploring temporal origin-destination data. Carried
          out a qualitative <Go to="/p/flowmap-user-study/">user study</Go> comparing animated and
          small-multiple representations of changes in flow maps.
        </Collapsible>

        <Collapsible
          content={
            <span className="em">MSc Computer Science, St. Petersburg State University, 2003</span>
          }
          pl={4}
        >
          <span className="flabel">Thesis title:</span> Statistical Query Transformations for
          Question Answering in the Web
          <br />
          <span className="flabel">Supervised by:</span>{' '}
          <Go to="https://www.linkedin.com/in/igornekrestyanov/">Igor Nekrestyanov</Go>
          <br />
          <span className="flabel">Summary:</span>
          Developed an improvement for a state-of-the-art machine learning approach transforming
          natural language questions into search engine queries achieving a better quality of{' '}
          <Go to="http://en.wikipedia.org/wiki/Question_answering">question answering</Go>.
        </Collapsible>
      </ResumeSection>

      <ResumeSection title="Experience" display="flex" flexDirection="column" gap={4} isExpanded>
        <Job
          title="Staff Software Engineer, Maps and Data Visualization"
          employerName="Foursquare"
          employerUrl="https://location.foursquare.com/products-studio/"
          startDate="July 2021"
          isExpanded
        >
          <JobItem>
            Technical leadership, architecture and development of{' '}
            <Go to="/p/fsq-studio">Foursquare Studio</Go>, a complex web-based visualization
            platform. Mentoring a team of 10+ engineers.
          </JobItem>

          <JobItem>
            Implementing various geospatial visualization features: 3d animated trip layer, flow
            layer for mobility visualization, time scale synchronization for multi-dataset
            animations, swipe mode, editable rich text map annotations, JSON config editor,
            draggable legend, map scale widget, etc.
          </JobItem>

          <JobItem>
            Contributed to the design and development of the{' '}
            <Go to="https://docs.foursquare.com/developer/docs/studio-map-sdk-overview">
              Foursquare Map SDK
            </Go>
            , enabling seamless integration of complex geospatial visualizations across multiple
            platforms (Web and Jupyter notebooks).
          </JobItem>

          <JobItem>
            Architecture and implementation of <Go to="/p/fsq-notebooks">SQL notebooks</Go> with map
            visualizations of the query results. LLM model integration for SQL generation.
          </JobItem>
          <JobItem>
            Developed the <Go to="/p/fsq-paris-2024">Paris Olympics Places</Go> app showcasing
            various APIs and Map SDK features.
          </JobItem>
        </Job>

        <Job
          title="Founder"
          employerName="GeoVisually"
          employerUrl="https://www.geovisually.com/"
          location="Zurich"
          startDate="November 2020"
          isExpanded
        >
          <JobItem>Interactive maps and geographic data visualization consultancy.</JobItem>
          <li>
            Architecture and development of <Go to="/p/mapcanv">MapCanv</Go>, a collaborative
            GeoJSON editor with highly efficient real-time messaging and CRDT conflict resolution.
          </li>

          <JobItem>
            Architecture and development of <Go to="/p/flowmap-city">Flowmap City</Go> – a web-based
            interactive analysis tool used by cities, transport and mobility providers for
            understanding travel demand.
          </JobItem>
          <JobItem>
            Developed the <Go to="/p/cobalt">Cobalt Supply Chain</Go> and{' '}
            <Go to="/p/makuta">Mining in Democratic Republic of the Congo</Go> apps for the NGO{' '}
            <Go to="https://www.resourcematters.org/">Resource Matters</Go>
          </JobItem>
        </Job>

        <Job
          title="Founding Engineer"
          employerName="Unfolded"
          employerUrl="https://www.unfolded.ai/"
          location="San Francisco (remote)"
          startDate="January 2021"
          endDate="May 2021"
          isExpanded
        >
          <JobItem>
            Helping to build the <Go to="/p/fsq-studio">Unfolded Studio</Go>, the next generation
            geospatial analytics platform. The company Unfolded was later acquired by Foursquare.
          </JobItem>
        </Job>

        <Job
          title="Staff Software Engineer, Front End and Data Visualization Lead"
          employerName="Teralytics"
          employerUrl="https://teralytics.net/"
          startDate="February 2015"
          endDate="December 2020"
          location="Zurich"
          isExpanded
        >
          <JobItem>
            Technical and strategic leadership, platform architecture, mentoring a team of
            developers.
          </JobItem>
          <JobItem>
            Designed and developed <Go to="/p/tera-transport/">exploratory data</Go>{' '}
            <Go to="/p/street-flow-zh/">visualization tools</Go> for the analysis of people mobility
            in various cities/countries around the world.
          </JobItem>
          <JobItem>
            Designed and developed{' '}
            <Go to="/p/sg-trains/">interactive dashboards and data visualizations</Go> for real-time
            transportation network monitoring, incident analysis, transportation planning in
            Singapore.
          </JobItem>
          <JobItem>
            Devised a system architecture for{' '}
            <Go to="/talks/2018-12-20-gflowiz/">scalable OD-data visualization</Go> to support
            interactive data analysis across billions of rows.
          </JobItem>
          <JobItem>
            Published <Go to="/p/flowmap.gl/">Flowmap.gl</Go>, an open-source library for drawing
            flow lines representing movement on geographic maps in WebGL.
          </JobItem>
          <JobItem>
            Developed <Go to="/p/flowmap.blue/">FlowmapBlue</Go>, an open-source tool for geographic
            flow map visualization from spreadsheets published in Google Sheets.
          </JobItem>
          <JobItem>
            Developed a series of interactive maps showing the{' '}
            <Go to="/p/covid-19/">effect the lock-down had on mobility</Go> which were published in
            La Repubblica, Forbes, Daily Mail, Bild, Osnabrücker Zeitung.
          </JobItem>
        </Job>

        <Job
          title="Data Visualization Engineer"
          employerName="Interactive Things"
          employerUrl="http://interactivethings.com/"
          startDate="June 2013"
          endDate="January 2015"
          location="Zurich"
        >
          <JobItem>
            Developed numerous interactive visualizations for Neue Zürcher Zeitung, e.g. a series of{' '}
            <Go to="/p/swiss-maps/">geograpic visualizations about Switzerland</Go>,{' '}
            <Go to="/p/ww1/">Interactive timeline of WWI</Go>, pieces on unemployment and{' '}
            <Go to="http://maps.nzzdali.ch/nzzdata/sommerserie-2014/medical-care/">medical care</Go>
            .
          </JobItem>
          <JobItem>
            Developed an interactive visualization of the{' '}
            <Go to="/p/african-trade/">trade of the world's countries with Africa.</Go>
          </JobItem>
          <JobItem>
            Developed a <Go to="/p/comp-browser/">visualization of research expertise</Go> for
            Zurich University of Applied Sciences.{' '}
          </JobItem>
          <JobItem>
            Developed <Go to="/p/gemeinwohl/">Public Value Atlas</Go> with the University of St.
            Gallen
          </JobItem>
          <JobItem>
            Developed an <Go to="/p/snf/">exploratory data analysis tool</Go> for Swiss National
            Science Foundation related to research proposals and activities.
          </JobItem>
        </Job>

        <Job
          title="PhD Student, Assistant, University of Fribourg"
          startDate="April 2009"
          endDate="May 2013"
        >
          <JobItem>
            {' '}
            Developed <Go to="/p/jflowmap/">JFlowMap</Go>, an experimental tool for the
            visualization of spatial interactions.
          </JobItem>
          <JobItem>
            Developed web-based <Go to="/p/aiddata/">visualizations of AidData</Go> (financial aid
            given to developing countries).
          </JobItem>
          <JobItem>
            Contributed to the <Go to="/p/birdeye/">BirdEye</Go> visualization library developed at
            the UN Centre for Advanced Visual Analytics.
          </JobItem>
          <JobItem>
            Assisted in courses on Web technologies and Functional programming. Tutoring, giving
            occasional lectures, preparing materials, building supporting websites and utilities.
          </JobItem>
          <JobItem>
            Tutoring in workshops on programming and computer graphics for students and school
            children.
          </JobItem>
        </Job>

        <Job
          title="Senior Software Engineer, Technical Team Lead, IT Department, University of Applied
            Sciences FH Joanneum, Graz"
          startDate="March 2007"
          endDate="April 2009"
        >
          <JobItem>
            Technical and strategic leadership, platform architecture, mentoring a team of
            developers.
          </JobItem>
          <JobItem>
            Developed <Go to="/p/joanna">web applications</Go> used by the students, lecturers and
            employees of the university for the online administration.
          </JobItem>
          <JobItem>
            Maintained the web and database server infrastructure for the online administration.
          </JobItem>
          <JobItem>
            Designed and developed a{' '}
            <Go to="/p/wissensbilanz">web application for collaborative data collection</Go> and
            consolidation to provide a statistical overview of study- and research-relevant
            indicators.
          </JobItem>
        </Job>

        <Job
          title="Software Engineer/Research Assistant, Dept of Information Design, University of
            Applied Sciences FH Joanneum, Graz"
          startDate="September 2005"
          endDate="March 2007"
        >
          <JobItem>
            Designed and developed <Go to="/p/cgvis/">CGVis</Go>, a visualization tool facilitating
            hierarchical clustering, zooming and animation for the exploration of multidimensional
            datasets.
          </JobItem>
          <JobItem>
            Designed and developed a standalone and a web version of a{' '}
            <Go to="/p/proclassify/">proteomic data classification tool</Go> implementing a cancer
            diagnosis method based on mass-spectrometry data facilitating multi-step feature
            reduction and SVM classification.
          </JobItem>
          <JobItem>
            Participated in the development of a{' '}
            <Go to="/p/fhlite">presentation management tool</Go> for the information screens
            installed at the university. Developed the visual layout editor for arranging multimedia
            objects on the screen and the schedule editor similar to calendar in Outlook.
          </JobItem>
          <JobItem>
            Improved the implementation of an algorithm detecting the behavior type of a user
            looking at a web page based on the real-time eye-tracking data.
          </JobItem>
        </Job>

        <Job
          title="Software Engineer, Ecofinance Finanzsoftware &amp; Consulting GmbH, Graz"
          startDate="June 2004"
          endDate="August 2005"
        >
          <JobItem>
            Participated in the development of a web based treasury system for Deutsche Bahn and
            Commerzbank.
          </JobItem>
          <JobItem>
            Implemented the Java infrastructure and XSLT stylesheets for the runtime generation of
            the front end UI code from XML sources.
          </JobItem>
          <JobItem>Evaluated and optimized the performance of the XSL transformations.</JobItem>
          <JobItem>
            Implemented support for long running jobs on the server-side of the system.
          </JobItem>
          <JobItem>
            Developed the context-sensitive help for the system and the help authoring
            infrastructure based on DocBook.
          </JobItem>
        </Job>

        <Job
          title="Software Engineer, Elbrus MCST (by contract with Sun Microsystems), St. Petersburg"
          startDate="August 2003"
          endDate="May 2004"
        >
          <JobItem>
            Worked in the Sun's{' '}
            <Go to="https://en.wikipedia.org/wiki/Swing_(Java)">Java Swing UI library</Go>{' '}
            maintenance team. Was responsible for fixing bugs and implementing requests for
            enhancements in the button classes (JButton, JRadioButton, JCheckBox, etc). Fixed a
            total of about 50 bugs in the Sun JDK.
          </JobItem>
        </Job>

        <Job
          title="Software Engineer, Aloha, St. Petersburg"
          startDate="January 2001"
          endDate="July 2003"
        >
          <JobItem>
            Designed and developed a <Go to="/p/daisy">web based e-commerce system</Go> with user
            authentication, order tracking, credit card processing, back-office, inventory,
            statistical reports, etc. Developed the whole system from scratch, supported and
            customized it adapting it to changing requirements. The system is still in use on
            several e-commerce websites.
          </JobItem>
        </Job>

        <Job
          title="Web Developer, ALife, St. Petersburg"
          startDate="March 2000"
          endDate="January 2001"
        >
          <JobItem>
            Participated in the development of a <Go to="/p/alife">system of intelligent agents</Go>{' '}
            capable of chatting to visitors of a website in a natural language and promoting its
            products. Implemented a highly dynamic web-interface for the subsystem that controlled
            the chats and let operators intervene in a chat if a bot was in trouble.
          </JobItem>
        </Job>

        <Job
          title="Teacher, Anichkov Lyceum, St. Petersburg"
          startDate="September 1998"
          endDate="April 2000"
        >
          <JobItem>Taught school children programming.</JobItem>
        </Job>
      </ResumeSection>

      <ResumeSection title="Technical Expertise">
        <span className="em">Architecture & Systems: </span>
        Distributed Systems, Real-time Collaboration, Performance Optimization, Scalable
        Architectures
        <br />
        <span className="em">Front-end Excellence: </span>
        React, Next.js, Node.js, Phoenix, WebGL, Modern Web APIs
        <br />
        <span className="em">AI & ML Experience: </span>
        Question Answering Systems, Classification, Clustering, Machine Learning Integration
        <br />
        <span className="em">Languages: </span>
        TypeScript/JavaScript, Java, Python, Elixir, Clojure, Scala, C
        <br />
        <span className="em">Cloud & Infrastructure: </span>
        Google Cloud, Cloudflare, Vercel, AWS, Kubernetes
        <br />
        <span className="em">Databases:</span> PostgreSQL, DuckDB, BigQuery, ClickHouse, Redis,
        MySQL, SQL Server
        <br />
        <span className="em">UI Design:</span> Figma, Sketch, Photoshop
        <br />
      </ResumeSection>

      <ResumeSection title="Public Speaking" isExpanded>
        <ul>
          <Talk>
            <TalkTitle href="/talks/2024-11-04-ethz-guest-lecture/">
              Geographic data visualization with deck.gl
            </TalkTitle>{' '}
            guest lecture at the{' '}
            <TalkVenue url="https://ikg.ethz.ch/en/">ETH Zürich Institute of Cartography</TalkVenue>
            , 2024
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2024-09-12-openjs-london/">
              Real-Time Collaborative Map Drawing with deck.gl
            </TalkTitle>{' '}
            at the OpenJS Visualization Summit, London, 2024
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2022-10-06-novi-sad/">
              Efficient data analytics and visualization in the browser
            </TalkTitle>{' '}
            at the <TalkVenue url="https://armada-js.com">Armada JS conference</TalkVenue>, Novi
            Sad, 2022
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2022-09-22-deck-summit/">
              Dynamically adaptive Deck.gl layer for mobility data in FlowmapBlue
            </TalkTitle>{' '}
            at the{' '}
            <TalkVenue url="https://deck.gl/events/madrid-summit-2022/">
              Open Visualization Collaborator Summit
            </TalkVenue>
            , Madrid, 2022
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2022-09-07-dvs-fireside-chat/">
              Fireside Chat with Past Information is Beautiful Award Winners
            </TalkTitle>{' '}
            at the{' '}
            <TalkVenue url="https://www.datavisualizationsociety.org/fireside-chats#">
              Data Visualization Society
            </TalkVenue>
            , 2022
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2022-08-09-fsq-webinar/">
              Mobility data analysis in Unfolded
            </TalkTitle>{' '}
            at the{' '}
            <TalkVenue url="https://connect.foursquare.com/2022-08-Unfolded-Toolbox-Geospatial-Solutions.html">
              FSQ/Unfolded Webinar
            </TalkVenue>
            , 2022
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2021-05-20-cartohack/">Introduction to Unfolded</TalkTitle> at
            the{' '}
            <TalkVenue url="https://visualisierung.dgfk.net/de/events/cartohack/07-unfolded/">
              CartoHack #07
            </TalkVenue>
            , German cartographic society, 2021
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2021-03-02-geohackmin/">
              Tools for Geo Data Visualization from the Unfolded team
            </TalkTitle>{' '}
            at the <TalkVenue url="https://cividi.ch/geohackmin-en/">Geo.Hackmin Week</TalkVenue>,
            2021
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2020-07-30-uc.foundation/">Presenting FlowmapBlue</TalkTitle> at
            the <TalkVenue url="https://uc.foundation/">Urban Computing Foundation</TalkVenue>{' '}
            Technical Advisory Council meeting, 2020
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2020-07-07-agit/">FlowmapBlue</TalkTitle> (in German) at the{' '}
            <TalkVenue url="https://agit.at/">AGIT symposium</TalkVenue>, 2020
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2020-05-13-datavis-meetup/">Flow Maps</TalkTitle> at the{' '}
            <TalkVenue url="https://www.meetup.com/datavis-zurich/events/270384574/">
              Data Visualization Zurich Meetup
            </TalkVenue>
            , online, 2020
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2020-01-22-datacouncil-meetup">
              Interactive Queries over Billions of Trips: Using ClickHouse for Mobility Data
            </TalkTitle>{' '}
            at the{' '}
            <TalkVenue url="https://www.meetup.com/en-AU/DataCouncil-AI-Zurich-Data-Engineering-Science/events/267081855/">
              DataCouncil Meetup
            </TalkVenue>
            , Zurich, 2020
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2019-11-17-datafest/">Visualizing Mobility</TalkTitle> at the{' '}
            <TalkVenue url="https://datafest.ge">DataFest</TalkVenue>, Tbilisi, 2019
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2019-11-05-on-data-and-design/">
              Meet-up talk on Visualizing Mobility
            </TalkTitle>{' '}
            at{' '}
            <TalkVenue url="https://www.meetup.com/de-DE/ondataanddesign-Switzerland/events/265947767/">
              On data and design
            </TalkVenue>
            , YAAY Studio, Basel, 2019
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2019-10-11-urban-mobility-symp/">
              Scalability of OD-data visualizations
            </TalkTitle>{' '}
            at the{' '}
            <TalkVenue url="https://www.citylab-berlin.org/events/mobilitysymposium_en/">
              Urban Mobility Symposium
            </TalkVenue>
            , CityLAB Berlin, 2019
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2019-04-03-unibern/">
              FlowmapBlue: Ein Tool zur Erstellung von Flow Maps
            </TalkTitle>{' '}
            (in German) at the{' '}
            <TalkVenue url="http://www.digitale-nachhaltigkeit.unibe.ch/studium/data_visualization_group/index_ger.html">
              Data Visualization Group meeting
            </TalkVenue>
            , University of Bern, 2019
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2019-03-22-ups/">Visualization of OD data</TalkTitle> at the UPS
            Advanced Technology Group workshop, online, 2019
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2019-03-03-clisel/">
              FlowmapBlue: Geographic flows visualisation tool for the people
            </TalkTitle>{' '}
            at the workshop{' '}
            <TalkVenue url="http://www.clisel.eu/Ascona">
              Environmental Changes and Human Mobility
            </TalkVenue>{' '}
            in Ascona, 2019
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2018-12-20-gflowiz/">
              Scalable Origin-Destination Data Visualization
            </TalkTitle>{' '}
            at{' '}
            <TalkVenue url="https://gflowizworkshop.sciencesconf.org">GFlowiz Workshop</TalkVenue>{' '}
            in Paris, 2018
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2018-07-11-react-meetup/">Graphics with React</TalkTitle> at{' '}
            <TalkVenue url="https://www.meetup.com/Zurich-ReactJS-Meetup/events/251517816/">
              React.js Meetup
            </TalkVenue>{' '}
            in Zurich, 2018
          </Talk>

          <Talk>
            <TalkTitle href="https://docs.google.com/presentation/d/e/2PACX-1vRNRaJFAwe13zoWrr7DPnJG4ujbvIccAmrfW-WCL4CGNU_GfYmRJlzbfJ7APOPl_9va1YzS0RNTrXjN/pub?start=false&loop=false&delayms=3000">
              Data Visualization Engineer: ist das ein Beruf?
            </TalkTitle>{' '}
            (in German) guest lecture, Mannheim University of Applied Sciences, 2017
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2015-11-27-react-meetup/">
              Visualizing People Movement with React
            </TalkTitle>{' '}
            at{' '}
            <TalkVenue url="http://www.meetup.com/Zurich-ReactJS-Meetup/events/226391438/">
              React.js Meetup
            </TalkVenue>{' '}
            in Zurich, 2015
          </Talk>

          <Talk>
            <TalkTitle href="/talks/2015-04-03-openvis/">
              Interactive Data Visualization with React: Taming the Complexity of the Changing State
            </TalkTitle>{' '}
            at <TalkVenue url="http://openvisconf.com/">OpenVis Conf</TalkVenue> in Boston, 2015
          </Talk>

          <Talk>
            <TalkTitle>Data Visualization for Media: Processes and Tools</TalkTitle> at{' '}
            <TalkVenue url="https://tech.ebu.ch/devcon14">EBU DevCon</TalkVenue> in Geneva, 2014
          </Talk>

          <Talk>
            <TalkTitle>Making Sense of Data with Visualization</TalkTitle> at SICHH Forum Data
            Visualization & Big Data, 2014
          </Talk>

          <Talk>
            Presented research work at the scientific data visualization conferences EuroVis and
            VisWeek
          </Talk>
        </ul>
      </ResumeSection>

      <ResumeSection title="Workshops" isExpanded>
        <ul>
          <li>
            <span className="pubTitle">
              Hands-on Visualization of Geographic Movement: How to make an interactive flow map
            </span>{' '}
            at <Go to="https://datafest.ge">DataFest</Go>, Tbilisi, 2019
          </li>
          <li>
            <span className="pubTitle">Robotics/Programming for kids with LEGO boost robot</span> at
            Freie Schule Bergmeilen, 2018
          </li>
          <li>
            <span className="pubTitle">UI development with Reagent in ClojureScript</span> at
            Clojure Meetup in Zurich, 2014
          </li>
          <li>
            <span className="pubTitle">
              Women in science: Drawing with computer for schoolgirls
            </span>{' '}
            at University of Fribourg, 2011 and 2012
          </li>
          <li>
            <span className="pubTitle">Programming and computer graphics for kids</span> at
            Kantonsschule Solothurn, 2012 and Gymnasium Brig, 2011
          </li>
        </ul>
      </ResumeSection>

      <ResumeSection title="Publications">
        <span className="pubTitle">
          <Go to="https://medium.com/teralytics/visualizing-mobility-data-the-scalability-challenge-2575fe819702">
            Visualizing mobility data: the scalability challenge
          </Go>
        </span>
        , Ilya Boyandin. Medium, Dec 2019.
        <br />
        <br />
        <span className="pubTitle">
          <Go to={'/assets/flowstrates-eurovis11-fin.pdf'}>
            Flowstrates: An Approach for Visual Exploration of Temporal Origin-Destination Data
          </Go>
        </span>
        , Ilya Boyandin, Enrico Bertini, Peter Bak, Denis Lalanne. Computer Graphics Forum,
        International Journal of the Eurographics Association, Eurographics/IEEE-VGTC Symposium on
        Visualization, Bergen, Norway, June 2011.
        <br />
        <br />
        <span className="pubTitle">
          <Go to="/assets/jflowmap-user-study.pdf">
            A Qualitative Study on the Exploration of Temporal Changes in Flow Maps with Animation
            and Small-Multiples
          </Go>
        </span>
        , Ilya Boyandin, Enrico Bertini, Denis Lalanne. Computer Graphics Forum, International
        Journal of the Eurographics Association, Eurographics/IEEE-VGTC Symposium on Visualization,
        Vienna, June 2012.
        <br />
        <br />
        {
          // <!--<span className="pubTitle"><Go to="http://ilya.boyandin.me/papers/jflowmap-eurovis10-poster.pdf">Visualizing the World’s Refugee Data with JFlowMap</Go></span>,
          // Ilya Boyandin, Enrico Bertini, Denis Lalanne.<br/>
          // Poster Abstract at Eurographics/IEEE-VGTC Symposium on Visualization, Bordeaux, France, June 2010.
          // <br/><br/>
          // -->
        }
        <span className="pubTitle">
          <Go to={'/assets/jflowmap-geova10.pdf'}>
            Using Flow Maps to Explore Migrations Over Time
          </Go>
        </span>
        , Ilya Boyandin, Enrico Bertini, Denis Lalanne. Workshop in Geospatial Visual Analytics:
        Focus on Time, GeoVA(t), Guimarães, Portugal, May 2010.
        <br />
        <br />
        <span className="pubTitle">
          <Go to="/assets/rcdl.pdf">
            Statistical Query Transformations for Question Answering in the Web
          </Go>
        </span>
        , Ilya Boyandin, Igor Nekrestyanov. Conference on Digital Libraries (RCDL'2003), St.
        Petersburg, October 2003.
        <br />
        <br />
        <span className="pubTitle">
          <Go to="/assets/thesis.pdf">Visualization of Temporal Origin-Destination Data</Go>
        </span>
        , PhD thesis, University of Fribourg, March 2013.
      </ResumeSection>

      <ResumeSection title="Awards">
        <ul>
          <li>
            Bronze award in the “Visualization & Information Design” category of the{' '}
            <Go to="https://www.informationisbeautifulawards.com/showcase/3815-flowmap-blue">
              Information is Beautiful Awards
            </Go>{' '}
            for <Go to="https://flowmap.blue">flowmap.blue</Go> in 2019.
          </li>
          <li>
            Shortlisted in the “Interactive Visualization” category of the{' '}
            <Go to="https://iibawards.herokuapp.com/showcase/552-public-value-atlas">
              Information is Beautiful Awards
            </Go>{' '}
            for <Go to="/p/gemeinwohl">Gemeinwohl</Go> in 2014.
          </li>
          <li>
            First prize in the “Interactive Graphics” category of the{' '}
            <Go to="https://www.wan-ifra.org/de/articles/2013/10/24/preistraeger-des-dpa-infografik-awards-2013-ausgezeichnet">
              dpa-infografik award
            </Go>{' '}
            for the <Go to="/p/swiss-maps">Swiss maps series</Go> in 2013.
          </li>
        </ul>
      </ResumeSection>

      <ResumeSection title="Other Activities">
        <ul>
          <li>
            Developed a{' '}
            <Go to="/p/covid19-charite-lus/">web app used for the COVID-19 medical study</Go>{' '}
            carried out at Charité Universitätsmedizin Berlin.
          </li>
          <li>
            Developed an interactive{' '}
            <Go to="/p/remittances/">visualization of the worldwide remittance flows</Go> published
            by the newspapers{' '}
            <Go to="http://www.tageswoche.ch/de/2013_19/schweiz/540004/milliarden-aus-der-fremde.htm">
              TagesWoche.ch
            </Go>{' '}
            and{' '}
            <Go to="http://derstandard.at/1363710784566/Wieviel-Geld-Migranten-zurueck-in-ihre-Heimat-schicken">
              derStandard.at
            </Go>
            .
          </li>
          <li>
            Developed a <Go to="/p/swiss-trains/">visualization of SBB train flows</Go> in a team of
            several developers at the Make Opendata Camp in Zurich.
          </li>
          <li>
            {
              // <!--Participated in the organization of the Russian Information Retrieval Evaluation Sembit.ly/sichhinar (ROMIP) and-->
            }
            Maintained the <Go to="http://www.romip.ru/en/index.html">website</Go> of the ROMIP
            information retrieval evaluation seminar with the use of a self-made Java XSLT-engine.
            {/*<!-- <Go to="http://www.romip.ru/en/index.html">the website of the seminar</Go> which is still in active use.-->*/}
          </li>
          <li>
            Developed <Go to="http://pof.sourceforge.net">phpObjectForms</Go>, an open-source
            library for building user-friendly web forms.
            {
              // <!--  The library was then downloaded more than 10000 times.-->
            }
          </li>
        </ul>
      </ResumeSection>

      {/*<h2>Spoken Languages</h2>*/}
      {/*<div className="block notitles">*/}
      {/*  <ul>*/}
      {/*    <li>English (full professional proficiency)</li>*/}
      {/*    <li>German (full professional proficiency)</li>*/}
      {/*    <li>French (intermediate)</li>*/}
      {/*    <li>Russian (mother tongue)</li>*/}
      {/*  </ul>*/}
      {/*</div>*/}

      <ResumeSection title="Hobbies">
        <Go to="http://soundcloud.com/ibananti">Electronic music production</Go>,{' '}
        <Go to="http://www.flickr.com/photos/ibananti/sets/">photography</Go>, hiking, traveling.
      </ResumeSection>
    </div>
  </CV>
);

export default Resume;
