// node export-sql.js <from> <to>  -> prints an INSERT ... ON CONFLICT upsert for scenarios[from..to) of the bundled files.
const fs=require("fs"),path=require("path");global.window={};
["scenarios.js"].concat(fs.readdirSync(__dirname).filter(f=>/^scenarios-batch\d+\.js$/.test(f)).sort())
 .forEach(f=>new Function("window",fs.readFileSync(path.join(__dirname,f),"utf8")).call(null,window));
const [a,b]=[+process.argv[2],+process.argv[3]];
const q=(t,v)=>"$"+t+"$"+v+"$"+t+"$";
const rows=window.SCENARIOS.slice(a,b).map((s,i)=>{
  const batch=window.SCENARIOS.indexOf(s)<18?1:2;
  return `('${s.id}',ARRAY[${s.positions.map(p=>"'"+p+"'").join(",")}],${q("t",s.title)},${q("j",JSON.stringify(s.sit))}::jsonb,${q("j",JSON.stringify(s.pre))}::jsonb,${q("j",JSON.stringify(s.play))}::jsonb,${batch})`;
});
console.log("insert into public.scenarios (id,positions,title,sit,pre,play,batch) values\n"+rows.join(",\n")+"\non conflict (id) do update set positions=excluded.positions,title=excluded.title,sit=excluded.sit,pre=excluded.pre,play=excluded.play,batch=excluded.batch;");
