import { TIME_OPTIONS } from '@/constants/request';
import { useAppDispatch, useAppSelector } from '@/store';
import { SelectWithSearch } from '@/components/select-with-search';
import { Separator } from '@/components/ui/separator';
import { updateField } from '@/slices/request-slice';

export default function WorkTimeRangeSelect() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);

  if (!request) return null;

  // console.log('request', request);

  const currentWorkTime = request.work_time;

  return (
    <div className="flex h-9">
      <SelectWithSearch
        options={TIME_OPTIONS}
        value={currentWorkTime.min}
        handleSelect={(val) =>
          dispatch(
            updateField({
              work_time: {
                ...currentWorkTime,
                min: val,
              },
            })
          )
        }
        id="work-time"
        className="rounded-r-none border-r-0"
      />
      <Separator orientation="vertical" />
      <SelectWithSearch
        options={TIME_OPTIONS}
        value={currentWorkTime.max}
        handleSelect={(val) =>
          dispatch(
            updateField({
              work_time: {
                ...currentWorkTime,
                max: val,
              },
            })
          )
        }
        id="workTime2"
        className="rounded-l-none border-l-0"
      />
    </div>
  );
}
