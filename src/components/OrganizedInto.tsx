import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function OrganizedInto() {
  return (
    <span>
      Organized into{' '}
      <Tooltip>
        <TooltipTrigger>Active</TooltipTrigger>
        <TooltipContent className="max-w-72" side="bottom">
          <span>
            Problem instances where quantum computations currently appear to challenge leading
            classical methods, and where further benchmarking is needed to determine whether an
            advantage exists.
          </span>
        </TooltipContent>
      </Tooltip>{' '}
      candidates,{' '}
      <Tooltip>
        <TooltipTrigger>Superseded</TooltipTrigger>
        <TooltipContent className="max-w-72" side="bottom">
          <span>
            Problem instances where quantum computations once appeared to challenge leading
            classical methods, but for which subsequent classical progress has closed or reversed
            the apparent gap.
          </span>
        </TooltipContent>
      </Tooltip>{' '}
      candidates and{' '}
      <Tooltip>
        <TooltipTrigger>Baseline</TooltipTrigger>
        <TooltipContent className="max-w-72" side="bottom">
          <span>
            Problem instances that provide useful reference points for comparing quantum and
            classical methods, including examples where the state-of-the-art solutions are
            classical.
          </span>
        </TooltipContent>
      </Tooltip>{' '}
      benchmarks.
    </span>
  );
}
