import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const COLS = 12;
const ROWS = 8;
const MIN_COLS = 1;
const MIN_ROWS = 1;

const initialCards = [
  { id: 1, col: 1, row: 1, cols: 5, rows: 3 },
  { id: 2, col: 6, row: 1, cols: 3, rows: 3 },
  { id: 3, col: 9, row: 1, cols: 4, rows: 2 },
  { id: 4, col: 1, row: 4, cols: 3, rows: 4 },
  { id: 5, col: 4, row: 4, cols: 5, rows: 4 },
  { id: 6, col: 9, row: 3, cols: 4, rows: 5 },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function overlaps(a, b) {
  return a.col < b.col + b.cols && a.col + a.cols > b.col && a.row < b.row + b.rows && a.row + a.rows > b.row;
}

function findFreeSlot(cards) {
  const preferred = { col: 1, row: 1, cols: 3, rows: 2 };

  for (let cols = preferred.cols; cols >= MIN_COLS; cols -= 1) {
    for (let rows = preferred.rows; rows >= MIN_ROWS; rows -= 1) {
      for (let row = 1; row <= ROWS - rows + 1; row += 1) {
        for (let col = 1; col <= COLS - cols + 1; col += 1) {
          const slot = { col, row, cols, rows };

          if (!cards.some((card) => overlaps(slot, card))) return slot;
        }
      }
    }
  }

  return null;
}

function findNearestSlot(card, cards) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (let row = 1; row <= ROWS - card.rows + 1; row += 1) {
    for (let col = 1; col <= COLS - card.cols + 1; col += 1) {
      const slot = { ...card, col, row };

      if (cards.some((item) => item.id !== card.id && overlaps(slot, item))) continue;

      const distance = (card.col - col) ** 2 + (card.row - row) ** 2;

      if (distance < nearestDistance) {
        nearest = slot;
        nearestDistance = distance;
      }
    }
  }

  return nearest;
}

function findNearestFittingSlot(card, cards) {
  let best = null;
  let bestScore = Infinity;

  for (let cols = card.cols; cols >= MIN_COLS; cols -= 1) {
    for (let rows = card.rows; rows >= MIN_ROWS; rows -= 1) {
      const slot = findNearestSlot({ ...card, cols, rows }, cards);

      if (!slot) continue;

      const areaLoss = card.cols * card.rows - cols * rows;
      const distance = (card.col - slot.col) ** 2 + (card.row - slot.row) ** 2;
      const score = areaLoss * 1000 + distance;

      if (score < bestScore) {
        best = slot;
        bestScore = score;
      }
    }
  }

  return best;
}

function App() {
  const boardRef = useRef(null);
  const snapTimerRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [motion, setMotion] = useState(null);

  function addCard() {
    setCards((items) => {
      const slot = findFreeSlot(items);

      if (!slot) return items;

      const id = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

      return [...items, { id, ...slot }];
    });
  }

  function deleteCard(id) {
    setCards((items) => items.filter((item) => item.id !== id));
  }

  function startPointer(event, card, action) {
    if (!editMode || event.button !== 0) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const startCard = { ...card };
    const { width, height } = boardRef.current.getBoundingClientRect();
    const cellW = width / COLS;
    const cellH = height / ROWS;
    let lastDx = 0;
    let lastDy = 0;

    event.currentTarget.setPointerCapture(event.pointerId);
    setMotion({ id: card.id, action, dx: 0, dy: 0 });

    function move(pointerEvent) {
      const dx = pointerEvent.clientX - startX;
      const dy = pointerEvent.clientY - startY;
      lastDx = dx;
      lastDy = dy;

      if (action === 'resize') {
        setMotion({ id: card.id, action, dx, dy });
        return;
      }

      setMotion({ id: card.id, action, dx, dy });
    }

    function up() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);

      const dCols = Math.round(lastDx / cellW);
      const dRows = Math.round(lastDy / cellH);

      let finalCard = startCard;

      setCards((items) => {
        const moved = items.map((item) => {
          if (item.id !== card.id) return item;

          if (action === 'resize') {
            return {
              ...item,
              cols: clamp(startCard.cols + dCols, MIN_COLS, COLS - startCard.col + 1),
              rows: clamp(startCard.rows + dRows, MIN_ROWS, ROWS - startCard.row + 1),
            };
          }

          return {
            ...item,
            col: clamp(startCard.col + dCols, 1, COLS - startCard.cols + 1),
            row: clamp(startCard.row + dRows, 1, ROWS - startCard.rows + 1),
          };
        });

        const current = moved.find((item) => item.id === card.id);

        if (!current || !moved.some((item) => item.id !== current.id && overlaps(current, item))) {
          finalCard = current ?? startCard;
          return moved;
        }

        const next = findNearestFittingSlot(current, moved) ?? startCard;
        finalCard = next;

        return moved.map((item) => (item.id === current.id ? next : item));
      });

      if (action === 'move') {
        const snapDx = (startCard.col - finalCard.col) * cellW + lastDx;
        const snapDy = (startCard.row - finalCard.row) * cellH + lastDy;

        setMotion({ id: card.id, action: 'snap', dx: snapDx, dy: snapDy });
        requestAnimationFrame(() => setMotion({ id: card.id, action: 'snap', dx: 0, dy: 0 }));
        clearTimeout(snapTimerRef.current);
        snapTimerRef.current = setTimeout(() => setMotion(null), 280);
      } else {
        setMotion(null);
      }
    }

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  return (
    <main className={editMode ? 'shell is-editing' : 'shell'}>
      <section ref={boardRef} className="board" aria-label="Dashboard grid">
        <div className="gridLayer" aria-hidden="true">
            {Array.from({ length: COLS - 1 }, (_, index) => (
              <span key={`col-${index}`} className="gridLine gridLineVertical" style={{ left: `${((index + 1) / COLS) * 100}%` }} />
            ))}
            {Array.from({ length: ROWS - 1 }, (_, index) => (
              <span key={`row-${index}`} className="gridLine gridLineHorizontal" style={{ top: `${((index + 1) / ROWS) * 100}%` }} />
            ))}
        </div>
        {cards.map((card) => {
          const activeMotion = motion?.id === card.id ? motion : null;
          const isResizing = activeMotion?.action === 'resize';

          return (
          <article
            key={card.id}
            className={activeMotion ? `card is-${activeMotion.action}` : 'card'}
            style={{
              gridColumn: `${card.col} / span ${card.cols}`,
              gridRow: `${card.row} / span ${card.rows}`,
              '--col': card.col,
              '--row': card.row,
              '--cols-span': card.cols,
              '--rows-span': card.rows,
              width: isResizing ? `calc(var(--cols-span) * 100% / var(--cols) - var(--gap) + ${activeMotion.dx}px)` : undefined,
              height: isResizing ? `calc(var(--rows-span) * 100% / var(--rows) - var(--gap) + ${activeMotion.dy}px)` : undefined,
              transform: activeMotion && !isResizing ? `translate3d(${activeMotion.dx}px, ${activeMotion.dy}px, 0)` : undefined,
            }}
            onPointerDown={(event) => startPointer(event, card, 'move')}
          >
            <div className="cardBody" />
            <button
              className="deleteCard"
              type="button"
              aria-label="Delete card"
              onClick={() => deleteCard(card.id)}
              onPointerDown={(event) => event.stopPropagation()}
              tabIndex={editMode ? 0 : -1}
            >
              удалить
            </button>
            <button
              className="resize"
              type="button"
              aria-label="Resize card"
              onPointerDown={(event) => {
                event.stopPropagation();
                startPointer(event, card, 'resize');
              }}
              tabIndex={editMode ? 0 : -1}
            />
          </article>
          );
        })}
      </section>

      <button className="addButton" type="button" onClick={addCard} aria-label="Add card" tabIndex={editMode ? 0 : -1}>
        +
      </button>

      <button className="editButton" type="button" onClick={() => setEditMode((value) => !value)}>
        <span>{editMode ? 'L' : 'E'}</span>
      </button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
