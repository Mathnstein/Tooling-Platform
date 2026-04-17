'use client';

import { useState } from 'react';
import { graphql } from '#/codegen/gql';
import { useMutation } from '@apollo/client/react';
import { CancelJobInput } from '#/codegen/gql/graphql';

const CANCEL_JOB_MUTATION = graphql(`
  mutation CancelJob($input: CancelJobInput!) {
    cancelJob(input: $input)
  }
`);


export default function JobCancelButton() {

    const [formData, setFormData] = useState<CancelJobInput>({
    id: '',
  });

  // useLazyQuery is perfect for buttons—it doesn't run until you call 'getJobs'
  const [cancelJob, { loading, error }] = useMutation(CANCEL_JOB_MUTATION, {
    // Optional: Refresh the jobs list after creation
    refetchQueries: ['GetJobs'], 
  });

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cancelJob({
        variables: {
          input: {
            ...formData
          }
        }
      });
      setFormData({ id: '' });
    } catch (err) {
      console.error(err);
    }
  };


  return (
   <form 
      onSubmit={handleSubmit} 
      className="space-y-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm"
    >
      <h2 className="text-xl font-bold text-black dark:text-zinc-50">Cancel Job</h2>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Job ID</label>
        <input 
          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-black dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={formData.id}
          onChange={e => setFormData({id: e.target.value})}
          placeholder="Enter Job UUID"
          required
        />
      </div>


      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
      >
        {loading ? 'Cancelling Job...' : 'Cancel Job'}
      </button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-xs">Error: {error.message}</p>
        </div>
      )}
    </form>
  );
}