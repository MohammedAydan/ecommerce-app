// "use client";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { apiBaseUrl } from "@/app/utils/strings";

// type Setting = {
//     key: string;
//     value: string;
//     description?: string;
// };

// export default function SettingsDashboard({ group = "Fawaterk" }) {
//     const [settings, setSettings] = useState<Setting[]>([]);
//     const [editingKey, setEditingKey] = useState<string | null>(null);
//     const [editingValue, setEditingValue] = useState<string>("");

//     useEffect(() => {
//         fetch(`${apiBaseUrl}/settings/${group.toLowerCase()}`)
//             .then((res) => res.json())
//             .then(setSettings);
//     }, [group]);

//     const handleSave = async () => {
//         if (!editingKey) return;

//         await fetch(`${apiBaseUrl}/settings/${editingKey}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ value: editingValue }),
//         });

//         setSettings((prev) =>
//             prev.map((s) =>
//                 s.key === editingKey ? { ...s, value: editingValue } : s
//             )
//         );
//         setEditingKey(null);
//         setEditingValue("");
//     };

//     return (
//         <div className="p-6 space-y-4">
//             <h2 className="text-2xl font-bold">Settings: {group}</h2>
//             <div className="grid gap-4">
//                 {settings.map((setting) => (
//                     <div
//                         key={setting.key}
//                         className="p-4 rounded border shadow-sm bg-muted flex justify-between items-center"
//                     >
//                         <div>
//                             <div className="font-semibold">{setting.key}</div>
//                             <div className="text-sm text-muted-foreground">{setting.description}</div>
//                             <div className="mt-1">
//                                 <span className="font-mono">{setting.value}</span>
//                             </div>
//                         </div>

//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <Button variant="outline" onClick={() => {
//                                     setEditingKey(setting.key);
//                                     setEditingValue(setting.value);
//                                 }}>
//                                     Edit
//                                 </Button>
//                             </DialogTrigger>
//                             <DialogContent>
//                                 <DialogHeader>Edit Setting</DialogHeader>
//                                 <Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
//                                 <Button className="mt-4" onClick={handleSave}>Save</Button>
//                             </DialogContent>
//                         </Dialog>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
