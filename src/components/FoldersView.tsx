import { useState } from 'react';
import { User } from '../App';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FolderOpen, Plus, Upload, File, ChevronRight, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface Folder {
  id: string;
  name: string;
  filesCount: number;
  createdDate: string;
  description: string;
}

interface FoldersViewProps {
  user: User;
}

export function FoldersView({ user }: FoldersViewProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mockFolders: Folder[] = [
    {
      id: '1',
      name: 'Criminal Cases 2024',
      filesCount: 45,
      createdDate: '2024-01-15',
      description: 'All criminal case documents for 2024',
    },
    {
      id: '2',
      name: 'Civil Litigation',
      filesCount: 32,
      createdDate: '2024-02-20',
      description: 'Civil case files and related documents',
    },
    {
      id: '3',
      name: 'Evidence Repository',
      filesCount: 127,
      createdDate: '2024-03-10',
      description: 'Digital evidence and exhibits',
    },
  ];

  const filteredFolders = mockFolders.filter(
    (folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockFiles = [
    { id: '1', name: 'Complaint_Johnson.pdf', size: '2.4 MB', uploadedDate: '2024-11-10' },
    { id: '2', name: 'Evidence_Photos.zip', size: '15.2 MB', uploadedDate: '2024-11-09' },
    { id: '3', name: 'Witness_Statement.docx', size: '156 KB', uploadedDate: '2024-11-08' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Folders & Files</h2>
          <p className="text-gray-500">Organize and manage case documents</p>
        </div>
        {user.permissions.canManageFolders && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Folder Name</Label>
                  <Input placeholder="Enter folder name" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Brief description of folder contents" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">Create Folder</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search folders by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFolders.map((folder) => (
              <Card
                key={folder.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedFolder(folder)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate">{folder.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{folder.filesCount} files</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{folder.description}</p>
                  <p className="text-xs text-gray-500">Created: {folder.createdDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredFolders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No folders found matching "{searchQuery}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFolder && (
        <Dialog open={!!selectedFolder} onOpenChange={() => setSelectedFolder(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-green-600" />
                  {selectedFolder.name}
                </DialogTitle>
                {user.permissions.canUploadFiles && (
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setUploadFiles(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button className="bg-green-600 hover:bg-green-700" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Files
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Folders</span>
                <ChevronRight className="w-4 h-4" />
                <span>{selectedFolder.name}</span>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b grid grid-cols-12 gap-4 text-sm">
                  <div className="col-span-6">File Name</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Uploaded</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  {mockFiles.map((file) => (
                    <div key={file.id} className="px-4 py-3 grid grid-cols-12 gap-4 items-center text-sm hover:bg-gray-50">
                      <div className="col-span-6 flex items-center gap-2">
                        <File className="w-4 h-4 text-gray-400" />
                        <span>{file.name}</span>
                      </div>
                      <div className="col-span-2 text-gray-600">{file.size}</div>
                      <div className="col-span-2 text-gray-600">{file.uploadedDate}</div>
                      <div className="col-span-2">
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {uploadFiles && uploadFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    {uploadFiles.length} file(s) selected for upload
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}