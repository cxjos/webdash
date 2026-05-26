import WeatherRenderer from './WeatherRenderer';
import CurrencyRenderer from './CurrencyRenderer';
import TimeRenderer from './TimeRenderer';

export default function Card({ card, editMode, motion, onPointerDown, onDelete, onTypeSelect }) {
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
      onPointerDown={(event) => onPointerDown(event, card, 'move')}
    >
      <div className="cardBody">
        {card.type ? (
          <div className="cardContent">
            {card.type === 'weather' && <WeatherRenderer config={card.config} />}
            {card.type === 'currency' && <CurrencyRenderer config={card.config} />}
            {card.type === 'time' && <TimeRenderer config={card.config} />}
          </div>
        ) : (
          <button
            className="selectType"
            type="button"
            onClick={() => onTypeSelect(card.id)}
            onPointerDown={(event) => event.stopPropagation()}
            tabIndex={editMode ? 0 : -1}
          >
            Выбрать
          </button>
        )}
      </div>
      <button
        className="deleteCard"
        type="button"
        aria-label="Delete card"
        onClick={() => onDelete(card.id)}
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
          onPointerDown(event, card, 'resize');
        }}
        tabIndex={editMode ? 0 : -1}
      />
    </article>
  );
}
