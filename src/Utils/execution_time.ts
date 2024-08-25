export function execution_time(job_name: string = "", callback: Function) {
  let result = undefined;

  let start = performance.now();
  result = callback();
  console.log(`${job_name} execution time: ${performance.now() - start} ms`);

  return result;
}
