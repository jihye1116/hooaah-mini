interface BottomButtonProps {
  onClick: () => void;
  text?: string;
  variant?: 'default' | 'full-width';
}

export default function BottomButton({
  onClick,
  text = '다시하기',
  variant = 'default',
}: BottomButtonProps) {
  const containerClasses =
    variant === 'full-width'
      ? 'fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 bg-white px-5 pt-4 pb-8'
      : 'fixed bottom-0 w-full max-w-[480px] bg-white p-4 pb-8';

  const buttonClasses =
    variant === 'full-width'
      ? 'w-full rounded-[15px] border-2 border-[#7A8CFF] bg-gradient-to-r from-[#7A8CFF] to-[#CAD1FF] py-4 text-base font-bold text-white'
      : 'flex-1 rounded-xl border-2 border-[#7A8CFF] bg-gradient-to-r from-[#7A8CFF] to-[#CAD1FF] py-4 font-bold text-white';

  return (
    <div className={containerClasses}>
      {variant === 'default' ? (
        <div className="flex gap-3">
          <button onClick={onClick} className={buttonClasses}>
            {text}
          </button>
        </div>
      ) : (
        <button onClick={onClick} className={buttonClasses}>
          {text}
        </button>
      )}
    </div>
  );
}
