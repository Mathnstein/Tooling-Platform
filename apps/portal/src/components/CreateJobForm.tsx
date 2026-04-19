'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { graphql } from '#/codegen/gql';

import { CreateJobInput } from '#/codegen/gql/graphql';

const CREATE_JOB_MUTATION = graphql(`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      toolId
      toolInput
      submittedBy {
        name
      }
    }
  }
`);

export default function CreateJobForm() {

  const [formData, setFormData] = useState<CreateJobInput>({
    toolId: '',
    toolInput: '',
    submittedById: 'current-user', // Hardcoded for now
  });

  const [createJob, { loading, error }] = useMutation(CREATE_JOB_MUTATION, {
    // Optional: Refresh the jobs list after creation
    refetchQueries: ['GetJobs'], 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedInput = {};
      try {
        // If toolInput is already an object (initial state), use it. 
        // If it's a string (from textarea), parse it.
        parsedInput = typeof formData.toolInput === 'string' 
          ? JSON.parse(formData.toolInput) 
          : formData.toolInput;
      } catch (parseError) {
        alert("Invalid JSON format in Input Data field");
        return;
      }
      await createJob({
        variables: {
          input: {
            ...formData,
            toolInput: parsedInput
          }
        }
      });
      setFormData(prev => ({ ...prev, toolId: '', toolInput: {} }));
    } catch (err) {
      console.error(err);
    }
  };

return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm"
    >
      <h2 className="text-xl font-bold text-black dark:text-zinc-50">Submit New Job</h2>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tool ID</label>
        <input 
          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-black dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={formData.toolId}
          onChange={e => setFormData({...formData, toolId: e.target.value})}
          placeholder="e.g. data-analyzer"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Data (JSON)</label>
        <textarea 
          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-black dark:text-white font-mono text-sm placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          rows={3}
          value={formData.toolInput}
          onChange={e => setFormData({...formData, toolInput: e.target.value})}
          placeholder='{"param": "value"}'
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
      >
        {loading ? 'Publishing to Queue...' : 'Create Job'}
      </button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-xs">Error: {error.message}</p>
        </div>
      )}
    </form>
  );
}