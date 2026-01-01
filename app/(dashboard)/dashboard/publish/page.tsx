"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { apiService } from "@/lib/api-client"
import { toast } from "sonner"
import { Music, Mic } from "lucide-react"

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["Music", "Sermon"]),
    genre: z.string().optional(),
    category: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    image: z.any().refine((files) => files?.length > 0, "Image is required"),
    file: z.any().refine((files) => files?.length > 0, "File is required"),
  })
  .refine(
    (data) => {
      if (data.type === "Music") return !!data.genre
      if (data.type === "Sermon") return !!data.category
      return true
    },
    {
      message: "Genre or Category is required based on type",
      path: ["genre"],
    },
  )

export default function PublishContentPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "Music",
      description: "",
    },
  })

  const type = form.watch("type")

  const publishMutation = useMutation({
    mutationFn: (data: FormData) => apiService.publishContent(data),
    onSuccess: () => {
      toast.success("Content published successfully!")
      form.reset()
      setPreviewImage(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to publish content")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("type", values.type)
    if (values.genre) formData.append("genre", values.genre)
    if (values.category) formData.append("category", values.category)
    formData.append("description", values.description)
    formData.append("image", values.image[0])
    formData.append("file", values.file[0])

    publishMutation.mutate(formData)
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Publish Your Content</CardTitle>
          <CardDescription>Share your music or sermons with the world.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Music">
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4" />
                              <span>Music</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Sermon">
                            <div className="flex items-center gap-2">
                              <Mic className="h-4 w-4" />
                              <span>Sermon</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {type === "Music" ? (
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Gospel">Gospel</SelectItem>
                            <SelectItem value="Worship">Worship</SelectItem>
                            <SelectItem value="Praise">Praise</SelectItem>
                            <SelectItem value="Christian Hip Hop">Christian Hip Hop</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Salvation">Salvation</SelectItem>
                            <SelectItem value="Faith">Faith</SelectItem>
                            <SelectItem value="Healing">Healing</SelectItem>
                            <SelectItem value="Prosperity">Prosperity</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files
                              if (files?.[0]) {
                                setPreviewImage(URL.createObjectURL(files[0]))
                                onChange(files)
                              }
                            }}
                            {...field}
                          />
                          {previewImage && (
                            <img
                              src={previewImage || "/placeholder.svg"}
                              alt="Preview"
                              className="h-32 w-full rounded-md object-cover"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Audio/Video File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*,video/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending ? "Publishing..." : "Publish Content"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
