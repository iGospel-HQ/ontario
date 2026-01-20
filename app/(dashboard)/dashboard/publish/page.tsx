// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { useMutation } from "@tanstack/react-query"
// import { apiService } from "@/lib/api-client"
// import { toast } from "sonner"
// import { Music, Mic } from "lucide-react"

// const formSchema = z
//   .object({
//     title: z.string().min(1, "Title is required"),
//     type: z.enum(["Music", "Sermon"]),
//     genre: z.string().optional(),
//     category: z.string().optional(),
//     description: z.string().min(1, "Description is required"),
//     image: z.any().refine((files) => files?.length > 0, "Image is required"),
//     file: z.any().refine((files) => files?.length > 0, "File is required"),
//   })
//   .refine(
//     (data) => {
//       if (data.type === "Music") return !!data.genre
//       if (data.type === "Sermon") return !!data.category
//       return true
//     },
//     {
//       message: "Genre or Category is required based on type",
//       path: ["genre"],
//     },
//   )

// export default function PublishContentPage() {
//   const [previewImage, setPreviewImage] = useState<string | null>(null)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       type: "Music",
//       description: "",
//     },
//   })

//   const type = form.watch("type")

//   const publishMutation = useMutation({
//     mutationFn: (data: FormData) => apiService.publishContent(data),
//     onSuccess: () => {
//       toast.success("Content published successfully!")
//       form.reset()
//       setPreviewImage(null)
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "Failed to publish content")
//     },
//   })

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     const formData = new FormData()
//     formData.append("title", values.title)
//     formData.append("type", values.type)
//     if (values.genre) formData.append("genre", values.genre)
//     if (values.category) formData.append("category", values.category)
//     formData.append("description", values.description)
//     formData.append("image", values.image[0])
//     formData.append("file", values.file[0])

//     publishMutation.mutate(formData)
//   }

//   return (
//     <div className="mx-auto max-w-2xl py-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Publish Your Content</CardTitle>
//           <CardDescription>Share your music or sermons with the world.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter title" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Type</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="Music">
//                             <div className="flex items-center gap-2">
//                               <Music className="h-4 w-4" />
//                               <span>Music</span>
//                             </div>
//                           </SelectItem>
//                           <SelectItem value="Sermon">
//                             <div className="flex items-center gap-2">
//                               <Mic className="h-4 w-4" />
//                               <span>Sermon</span>
//                             </div>
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {type === "Music" ? (
//                   <FormField
//                     control={form.control}
//                     name="genre"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Genre</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select genre" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Gospel">Gospel</SelectItem>
//                             <SelectItem value="Worship">Worship</SelectItem>
//                             <SelectItem value="Praise">Praise</SelectItem>
//                             <SelectItem value="Christian Hip Hop">Christian Hip Hop</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 ) : (
//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Category</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Salvation">Salvation</SelectItem>
//                             <SelectItem value="Faith">Faith</SelectItem>
//                             <SelectItem value="Healing">Healing</SelectItem>
//                             <SelectItem value="Prosperity">Prosperity</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 )}
//               </div>

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea placeholder="Enter description" className="min-h-[200px]" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="image"
//                   render={({ field: { value, onChange, ...field } }) => (
//                     <FormItem>
//                       <FormLabel>Cover Image</FormLabel>
//                       <FormControl>
//                         <div className="space-y-2">
//                           <Input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                               const files = e.target.files
//                               if (files?.[0]) {
//                                 setPreviewImage(URL.createObjectURL(files[0]))
//                                 onChange(files)
//                               }
//                             }}
//                             {...field}
//                           />
//                           {previewImage && (
//                             <img
//                               src={previewImage || "/placeholder.svg"}
//                               alt="Preview"
//                               className="h-32 w-full rounded-md object-cover"
//                             />
//                           )}
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="file"
//                   render={({ field: { value, onChange, ...field } }) => (
//                     <FormItem>
//                       <FormLabel>Audio/Video File</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="audio/*,video/*"
//                           onChange={(e) => onChange(e.target.files)}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
//                 disabled={publishMutation.isPending}
//               >
//                 {publishMutation.isPending ? "Publishing..." : "Publish Content"}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




// app/dashboard/publish/PublishInstructionsClient.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Mic2, Mail, ArrowRight } from "lucide-react";

export default function PublishContentPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-3 md:py-12">
      <div className="max-w-4xl mx-auto sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 md:space-y-16"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to Upload Your Gospel Content on iGospel
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              iGospel is a growing gospel media platform designed to help gospel creators reach wider audiences, build community, and receive direct support from listeners.
            </p>
          </motion.div>

          {/* Content Types */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <Music className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Music Content</h3>
              </div>
              <p className="text-gray-700">Submitted by Gospel Artists</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Mic2 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sermon Content</h3>
              </div>
              <p className="text-gray-700">Submitted by Ministers, Pastors, and Ministries</p>
            </div>
          </motion.div>

          {/* Submission Steps */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              How Content Submission Works
            </h2>

            <ol className="space-y-8 list-decimal list-inside marker:text-red-600 marker:font-bold marker:text-xl">
          

              <li className="bg-white rounded-xl p-6 shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Your Content via Email</h3>
                <p className="text-base text-gray-700 mb-4">
                  All music and sermon content should be sent to our official submission email:
                </p>

                <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-center mb-6">
                  <p className="text-xl font-bold text-red-700 break-all">
                    igospelmediaconnect@gmail.com
                  </p>
                </div>

                <p className="text-base text-gray-700 mb-5">
                  Please ensure your submission follows the guidelines provided in your dashboard to avoid delays.<br />
                  Also, include the required details below in your email based on the type of content you are submitting.
                </p>

                {/* Music Requirements */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5" /> Music Submission Requirements
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-gray-700">
                    <li>Artist name</li>
                    <li>Profile ID (You can get it in the profile section in your dashboard)</li>
                    <li>Email address (used during account creation)</li>
                    <li>Phone number</li>
                    <li>Song title</li>
                    <li>Genre (e.g. Afro Gospel, Worship, Praise, Contemporary Gospel, etc.)</li>
                    <li>Artwork / cover image</li>
                    <li>Content description (short description of the song)</li>
                  </ul>
                </div>

                {/* Sermon Requirements */}
                <div>
                  <h4 className="text-lg font-bold text-orange-700 mb-4 flex items-center gap-2">
                    <Mic2 className="w-5 h-5" /> Sermon Submission Requirements
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-gray-700">
                    <li>Minister / Ministry name</li>
                    <li>Profile ID (You can get it in the profile section in your dashboard)</li>
                    <li>Email address (used during account creation)</li>
                    <li>Phone number</li>
                    <li>Category (e.g. Faith, Finance, Prayer, Leadership, Family, etc.)</li>
                    <li>Artwork / cover image</li>
                    <li>Content description (short description of the sermon)</li>
                  </ul>
                </div>
              </li>

              <li className="bg-white rounded-xl p-6 shadow border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Review & Publishing</h3>
                <p className="text-base text-gray-700">
                  All submitted content is reviewed and published within 24 to 72 hours, provided it meets iGospel’s content standards.
                </p>
              </li>
            </ol>
          </motion.div>

         
        </motion.div>
      </div>
    </div>
  );
}
