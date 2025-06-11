import { Input } from '@/components/ui/input';
import type { MoveSize } from '@/types/move-size';
import { useGetEntranceTypesQuery } from '@/services/entrance-types-api';

interface MoversMatrixProps {
  value: MoveSize['crew_size_settings'];
  onChange: (value: number[][]) => void;
}

export function MoversMatrix({ value, onChange }: MoversMatrixProps) {
  const { data: floorOptions } = useGetEntranceTypesQuery();

  if (!floorOptions) return null;

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    newValue: number
  ) => {
    const updatedMatrix = value.map((row, i) =>
      row.map((cell, j) => (i === rowIndex && j === colIndex ? newValue : cell))
    );
    onChange(updatedMatrix);
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border">
      {/* Header */}
      <div className="bg-slate-900 text-white text-center p-1.5 font-semibold text-sm">
        TO STAIRS
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="bg-slate-900 text-white p-4 flex flex-col items-center justify-center w-8">
          <div className="transform -rotate-90 whitespace-nowrap font-semibold text-sm">
            FROM STAIRS
          </div>
        </div>

        {/* Grid content */}
        <div className="bg-background p-4 flex-1">
          {/* Column headers */}
          <div
            className="grid mb-4"
            style={{
              gridTemplateColumns: `repeat(${floorOptions.length + 1}, 1fr)`,
            }}
          >
            <div></div>
            {floorOptions.map((floor, index) => (
              <div
                key={`col-${index}`}
                className="flex items-center justify-center text-muted-foreground font-medium text-sm"
              >
                {floor.name.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="grid gap-2">
            {floorOptions.map((originFloor, originIndex) => (
              <div
                key={`row-${originIndex}`}
                className="grid gap-2 items-center"
                style={{
                  gridTemplateColumns: `repeat(${
                    floorOptions.length + 1
                  }, 1fr)`,
                }}
              >
                {/* Row header */}
                <div className="text-muted-foreground text-sm font-medium text-center">
                  {originFloor.name.slice(0, 3)}
                </div>

                {/* Row cells */}
                {floorOptions.map((_, destinationIndex) => (
                  <Input
                    key={`cell-${originIndex}-${destinationIndex}`}
                    name={`cell-${originIndex}-${destinationIndex}`}
                    type="number"
                    className="w-full p-0 text-center"
                    inputMode="numeric"
                    value={value[originIndex][destinationIndex]}
                    onChange={(e) =>
                      handleCellChange(
                        originIndex,
                        destinationIndex,
                        Number(e.target.value)
                      )
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
