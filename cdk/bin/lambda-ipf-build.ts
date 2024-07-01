import * as esbuild from "esbuild";

//Top-level 'await' expressions are only allowed when the 'module' option is set to 'es2022', 
//'esnext', 'system', 'node16', or 'nodenext', and the 'target' option is set to 'es2017' or higher.
esbuild.build({
    entryPoints: ['services/serverless/import-service/functions/**'],
    bundle: true,
    platform: 'node',
    target: ['node20'],
    //outfile: 'out.js',
    outdir: 'dist/import-service/lambdas',
    format: 'cjs',
  })
