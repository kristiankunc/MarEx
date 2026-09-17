export interface QuizQuestion {
  statement: string;
  choices: string[];
}

export interface ExerciseItem {
  url: string;
  statement: string;
  answer: string;
}

export type PageData =
  | { type: 'quiz'; questions: QuizQuestion[] }
  | { type: 'exercise'; exercises: ExerciseItem[] }
  | { type: 'none' };

export function extractPageData(doc: Document = document): PageData {
  const originalTex = new Map<Element, { tex: string; display: boolean }>();
  const mathItems = (window as any).MathJax?.startup?.document?.math;
  for (const item of mathItems ?? []) {
    if (item.typesetRoot) originalTex.set(item.typesetRoot, { tex: item.math, display: !!item.display });
  }

  function mjxToLatex(container: Element): string {
    const original = originalTex.get(container);
    if (!original) return '';
    return original.display ? `$$${original.tex}$$` : `$${original.tex}$`;
  }

  function nodeToText(node: ChildNode): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
    if (!(node instanceof Element)) return '';
    if (node.tagName.toLowerCase() === 'mjx-container') return mjxToLatex(node);
    return Array.from(node.childNodes).map(nodeToText).join('');
  }

  function extractText(el: Element): string {
    return Array.from(el.childNodes)
      .map(nodeToText)
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const quizPanels = doc.querySelectorAll('.quiz');
  if (quizPanels.length > 0) {
    const questions = Array.from(quizPanels).map((panel) => {
      const statementEl = panel.querySelector('#question-statement');
      return {
        statement: statementEl ? extractText(statementEl) : '',
        choices: Array.from(panel.querySelectorAll('.row.bottom-buffer .col-md-9')).map(extractText),
      };
    });
    return { type: 'quiz', questions };
  }

  const exerciseBlocks = doc.querySelectorAll('.exercise-question');
  if (exerciseBlocks.length > 0) {
    const exercises = Array.from(exerciseBlocks).map((block) => {
      const link = block.querySelector('a[href*="/problems/"]');
      const url = link?.getAttribute('href') ?? '';
      const id = url.match(/\/problems\/(\d+)/)?.[1];
      const p = block.querySelector('p');
      const label = p?.querySelector('strong') ?? null;
      const statement = p
        ? Array.from(p.childNodes)
            .filter((node) => node !== label)
            .map(nodeToText)
            .join('')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^:\s*/, '')
        : '';
      const answerEl = id ? doc.getElementById(`collapse-answer-${id}`)?.querySelector('.well') : null;
      const answer = answerEl ? extractText(answerEl) : '';
      return { url, statement, answer };
    });
    return { type: 'exercise', exercises };
  }

  return { type: 'none' };
}

export function formatPageText(data: PageData): string {
  if (data.type === 'quiz') {
    return data.questions
      .map(({ statement, choices }) => {
        if (choices.length === 0) return statement;
        const items = choices.map((choice) => `\\item ${choice}`).join('\n');
        return `${statement}\n\\begin{enumerate}\n${items}\n\\end{enumerate}`;
      })
      .join('\n\n');
  }
  if (data.type === 'exercise') {
    return data.exercises
      .map(({ statement, answer }) => (answer ? `${statement}\n${answer}` : statement))
      .join('\n\n');
  }
  return '';
}
