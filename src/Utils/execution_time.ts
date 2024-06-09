export function execution_time(job_name: string = "", callback: Function) {
  let start = performance.now();
  callback();
  console.log(`${job_name} execution time: ${performance.now() - start} ms`);
}
