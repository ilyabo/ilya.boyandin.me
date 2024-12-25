---
kind: project
title: SimQA – Question Answering
category: works
date: 2003-10-03
preview: simqa.png
---

<button href="/media/projects/simqa/simqa.pdf">Summary Slides</button>
<button href="/assets/rcdl_2003_en.pdf" variant=outline>RCDL 2003 Paper</button>
<button href="/media/projects/simqa/simqa.mp3" variant=outline>Audio Overview (NotebookLM)</button>
<button href="/media/projects/simqa/simqa-thesis.pdf" variant=outline>Thesis (in Russian)</button>

<img src=simqa.png alt="Components of a Question Answering System">

This system, developed for my master's thesis,
learned how to transform queries for [question answering](https://en.wikipedia.org/wiki/Question_answering)
in the Web. The goal of such transformations is to construct a query for a
traditional Web search engine given a factual natural language question so that
the first several documents returned by the search engine by this query contain
the correct answer to the original question. In other words, the system enhances web-based question answering by transforming natural language questions into effective search engine queries. It uses statistical algorithms, particularly the QASM model, to learn the best ways to modify a question for optimal search results. The system addresses the challenge of fact-based question answering on the web, where the quality of query transformation is crucial.
Key aspects and features of the system include:

- Query transformation modifies questions by adding, deleting, or replacing words, or by adding search engine syntax operators. Transformations are categorized into "translation" transformations that express the query in a different way and "refinement" transformations that modify the semantics of the query.
- The system employs atomic operators, such as stemming and stop word removal, to make transformations.
- A training process uses a set of questions and answers to learn the best sequences of atomic transformations. The system uses an Expectation Maximization (EM) algorithm to iteratively improve the model. The QASM algorithm is trained to map query contexts to the best atomic transformation operators.
- A modified QASM algorithm (modQASM) generates multiple query variations and uses a scoring function to select the most relevant ones. This modification addresses the issue that different transformations may be optimal for very similar questions.
- The system is evaluated using Mean Reciprocal Rank (MRR) and Total Reciprocal Document Rank (TRDR) metrics. These metrics measure the effectiveness of the query transformations by considering the rank of correct answers in search results. TRDR is more sensitive to differences in query effectiveness as it considers all correct answers within the top results, whereas MRR only considers the first correct answer.
- A prototype system was developed using the Yandex search engine and its specific syntax. It includes specific operators for the Yandex search engine, such as one that disables morphological analysis.
- The system uses the TRDR metric for both training and evaluation purposes.
- In modQASM, each generated query is given a significance score, which can be based on the probability of its selection or the selectivity of the atomic operators used to create it.
- Experimental results showed that the modified QASM algorithm outperformed the original QASM and direct Yandex search. The experiments also showed that the removal of words operator and the number of proper nouns in a query were the most significant for the overall effectiveness of the system.
  The system aims to improve the accuracy of web searches for fact-based questions by intelligently transforming them into queries that produce the most relevant results. The research also explores the limitations of current query transformation methods and how to address them.
